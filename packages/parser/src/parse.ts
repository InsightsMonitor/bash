import { EOF, Lexer as ChevLexer, Parser as ChevParser } from 'chevrotain'

import {
  ALL_TOKENS,
  EQUAL,
  IDENTIFIER,
  NEWLINE,
  REDIRECTION_FORWARD_DOUBLE,
  REDIRECTION_FORWARD_SINGLE,
  SEMICOLON,
} from './tokens'

const Lexer = new ChevLexer(ALL_TOKENS, {
  deferDefinitionErrorsHandling: true,
  ensureOptimizations: true,
  positionTracking: 'onlyStart',
})

export class Parser extends ChevParser {
  public Script = this.RULE('Script', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.Command) },
        { ALT: () => this.CONSUME(SEMICOLON) },
        { ALT: () => this.CONSUME(NEWLINE) },
      ])
    })

    this.OPTION(() => {
      this.CONSUME(EOF)
    })
  })

  protected Command = this.RULE('Command', () => {
    this.CONSUME1(IDENTIFIER)

    this.OR([
      { ALT: () => this.SUBRULE(this.Redirection) },
      {
        ALT: () =>
          this.MANY(() => {
            this.CONSUME2(IDENTIFIER)

            this.OPTION(() => {
              this.SUBRULE1(this.Redirection)
            })
          }),
      },
    ])
  })

  // @TODO: Fix ambiguities and use this new structure
  protected SimpleCommand = this.RULE('SimpleCommand', () => {
    this.OPTION(() => {
      this.SUBRULE(this.Assignment)
    })
    this.OPTION1(() => {
      this.CONSUME2(IDENTIFIER)
    })
    this.OPTION2(() => {
      this.SUBRULE1(this.Assignment)
    })
  })

  protected Assignment = this.RULE('Assignment', () => {
    this.CONSUME1(IDENTIFIER)
    this.CONSUME2(EQUAL)
    this.CONSUME3(IDENTIFIER)
  })

  protected WordList = this.RULE('WordList', () => {
    this.MANY(() => {
      this.CONSUME(IDENTIFIER)
    })
  })

  // @TODO complete
  protected Redirection = this.RULE('Redirection', () => {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.RedirectionA),
      },
      {
        ALT: () => this.SUBRULE(this.RedirectionB),
      },
    ])
  })

  protected RedirectionA = this.RULE('RedirectionA', () => {
    this.CONSUME(REDIRECTION_FORWARD_SINGLE)
    this.CONSUME(IDENTIFIER)
  })

  protected RedirectionB = this.RULE('RedirectionB', () => {
    this.CONSUME(REDIRECTION_FORWARD_DOUBLE)
    this.CONSUME(IDENTIFIER)
  })

  constructor(input) {
    super(input, ALL_TOKENS, {
      // maxLookahead: 0, // tune this to detect and debug bottle-necks
      outputCst: true,
      recoveryEnabled: false,
    })

    Parser.performSelfAnalysis(this)
  }
}

const tokens = (list = []) => {
  return list.map(t => {
    const { length } = t.image
    const range: [number, number] = [t.startOffset, t.startOffset + length]

    return {
      loc: {
        end: { column: t.startColumn + length, line: t.startLine },
        start: { column: t.startColumn, line: t.startLine },
      },
      range,
      type: t.tokenType.tokenName,
      value: t.image,
    }
  })
}

const errors = (list = []) =>
  list.map(({ name, message, token }) => {
    const location = {
      end: {
        column: token.startColumn + token.image.length,
        line: token.startLine,
      },
      start: { line: token.startLine, column: token.startColumn },
    }

    return { name, message, location }
  })

// defining the parser once improves performance and is recommended
const parser = new Parser([])

export const parse = source => {
  if (typeof source !== 'string') {
    throw new Error('You must pass a string as source')
  }

  const lexingResult = Lexer.tokenize(source)

  if (lexingResult.errors.length > 0) {
    // @TODO: Improve this
    throw {
      data: lexingResult.errors,
    }
  }

  parser.input = lexingResult.tokens

  const value = parser.Script()
  const parseErrors = errors(parser.errors)

  if (parseErrors.length) {
    const { message, location } = parseErrors[0]
    const { column, line } = location.start

    const err = new SyntaxError(`${message} at ${line}:${column}`)

    throw err
  }

  return {
    lexErrors: lexingResult.errors,
    parseErrors,
    parser,
    tokens: tokens(lexingResult.tokens),
    value,
  }
}
