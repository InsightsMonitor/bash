import { createToken, Lexer } from 'chevrotain'

// Using the negative lookahead to avoid matching commang substitution
export const IDENTIFIER = createToken({
  name: 'IDENTIFIER',
  pattern: /([A-Za-z_\-0-9\{\}=?+\/.@~%!\]\[#*]|\$(?!\())+/,
})

export const TERMINATOR = createToken({ name: 'TERMINATOR', pattern: Lexer.NA })

export const SEMICOLON = createToken({
  categories: TERMINATOR,
  line_breaks: true,
  name: 'SEMICOLON',
  pattern: ';',
})
export const REDIRECTION_FORWARD_SINGLE = createToken({
  name: 'REDIRECTION_FORWARD_SINGLE',
  pattern: '>',
})
export const REDIRECTION_FORWARD_DOUBLE = createToken({
  name: 'REDIRECTION_FORWARD_DOUBLE',
  pattern: '>>',
})

export const IF = createToken({
  longer_alt: IDENTIFIER,
  name: 'IF',
  pattern: 'if',
})
export const FI = createToken({
  longer_alt: IDENTIFIER,
  name: 'FI',
  pattern: 'fi',
})
export const BACKTICK = createToken({
  name: 'BACKTICK',
  pattern: /`/,
})
export const THEN = createToken({
  longer_alt: IDENTIFIER,
  name: 'THEN',
  pattern: 'then',
})
export const ELSE = createToken({
  longer_alt: IDENTIFIER,
  name: 'ELSE',
  pattern: 'else',
})
export const ELIF = createToken({
  longer_alt: IDENTIFIER,
  name: 'ELIF',
  pattern: 'elif',
})
export const SQ_BRACKET_LEFT = createToken({
  name: 'SQ_BRACKET_LEFT',
  pattern: '[',
})
export const PROCESS_SUBSTITUTION_LT_LEFT = createToken({
  name: 'PROCESS_SUBSTITUTION_LT_LEFT',
  pattern: '<(',
})
export const PROCESS_SUBSTITUTION_GT_LEFT = createToken({
  name: 'PROCESS_SUBSTITUTION_GT_LEFT',
  pattern: '>(',
})
export const COMMAND_SUBSTITUTION_LEFT = createToken({
  name: 'COMMAND_SUBSTITUTION_LEFT',
  pattern: '$(',
})
export const PARENTHESES_RIGHT = createToken({
  name: 'PARENTHESES_RIGHT',
  pattern: ')',
})
export const PARENTHESES_LEFT = createToken({
  name: 'PARENTHESES_LEFT',
  pattern: '(',
})
export const CURLY_BRACKET_LEFT = createToken({
  longer_alt: IDENTIFIER,
  name: 'CURLY_BRACKET_LEFT',
  pattern: '{',
})
export const CURLY_BRACKET_RIGHT = createToken({
  name: 'CURLY_BRACKET_RIGHT',
  pattern: '}',
})
export const SQ_BRACKET_2_LEFT = createToken({
  name: 'SQ_BRACKET_2_LEFT',
  pattern: '[[',
})
export const SQ_BRACKET_RIGHT = createToken({
  name: 'SQ_BRACKET_RIGHT',
  pattern: ']',
})
export const SQ_BRACKET_2_RIGHT = createToken({
  name: 'SQ_BRACKET_2_RIGHT',
  pattern: ']]',
})
export const COMMENT = createToken({
  name: 'COMMENT',
  pattern: /#[^\n\r]*/,
})
export const STRING = createToken({
  name: 'STRING',
  pattern: /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/,
})
export const BACKTICK_STRING = createToken({
  name: 'BACKTICK_STRING',
  pattern: /([`])((\\{2})*|(.*?[^\\](\\{2})*))\1/,
})
export const PIPE = createToken({
  name: 'PIPE',
  pattern: '|',
})
export const OR = createToken({
  name: 'OR',
  pattern: '||',
})
export const AND = createToken({
  name: 'AND',
  pattern: '&&',
})
export const AMPERSAND = createToken({
  name: 'AMPERSAND',
  pattern: '&',
})

const WHITESPACE = createToken({
  group: Lexer.SKIPPED,
  name: 'WHITESPACE',
  pattern: /[\s\t]+/,
})
const LINE_CONTINUATION = createToken({
  group: Lexer.SKIPPED,
  name: 'LINE_CONTINUATION',
  pattern: `\\
`,
})

export const NEWLINE = createToken({
  categories: TERMINATOR,
  line_breaks: true,
  name: 'NEWLINE',
  pattern: /\s*[\n\r]+/,
})

export const ALL_TOKENS = [
  LINE_CONTINUATION,
  NEWLINE,
  WHITESPACE,

  // first
  STRING,
  BACKTICK_STRING,
  COMMENT,

  //
  COMMAND_SUBSTITUTION_LEFT,
  PROCESS_SUBSTITUTION_LT_LEFT,
  PROCESS_SUBSTITUTION_GT_LEFT,
  PARENTHESES_RIGHT,
  CURLY_BRACKET_RIGHT,
  AND,
  OR,
  TERMINATOR,
  SEMICOLON,
  REDIRECTION_FORWARD_DOUBLE,
  REDIRECTION_FORWARD_SINGLE,
  IF,
  PIPE,
  FI,
  THEN,
  ELSE,
  ELIF,
  SQ_BRACKET_2_LEFT,
  SQ_BRACKET_2_RIGHT,
  SQ_BRACKET_LEFT,
  SQ_BRACKET_RIGHT,
  PARENTHESES_LEFT,
  CURLY_BRACKET_LEFT,
  BACKTICK,
  AMPERSAND,

  // last
  IDENTIFIER,
]
