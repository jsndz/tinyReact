// src/tokenizer/tokenizer.ts
var TYPES = {
  BOOLEAN: "Boolean",
  IDENTIFIER: "Identifier",
  KEYWORD: "Keyword",
  NULL: "Null",
  NUMERIC: "Numeric",
  PUCNTUATOR: "Punctuator",
  REGULAR_EXPRESSION: "RegularExpression",
  STRING: "String",
  TEMPLATE: "Template",
  TEMPLATE_HEAD: "TemplateHead",
  TEMPLATE_MIDDLE: "TemplateMiddle",
  TEMPLATE_TAIL: "TemplateTail",
  COMMENT_BLOCK: "CommentBlock",
  COMMENT_LINE: "CommentLine",
  SPACE: "Space",
  MODIFIER: "Modifier",
  JSX_TAG_OPENER_START: "JSXTagOpenerStart",
  JSX_TAG_OPENER_END: "JSXTagOpenerEnd",
  JSX_TAG_OPENER_END_CHILDLESS: "JSXTagOpenerEndChildless",
  JSX_TAG_CLOSER_START: "JSXTagCloserStart",
  JSX_TAG_CLOSER_END: "JSXTagCloserEnd",
  JSX_EXPRESSION_START: "JSXExpressionStart",
  JSX_EXPRESSION_END: "JSXExpressionEnd",
  JSX_TEXT: "JSXText",
  JSX_COMMENT: "JSXComment"
};
var CHILDLESS_TAGS = {
  area: true,
  base: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
var jsx2tokens = function() {
  function isChildlessTagName(s) {
    return CHILDLESS_TAGS[s] === true;
  }
  function isMaybeRegexp(token, token2, token3, token4) {
    return !token || token.type === TYPES.MODIFIER || token.type === TYPES.JSX_EXPRESSION_START || token.type === TYPES.KEYWORD && (!token2 || token2.value !== ".") || token.value === "!" && isMaybeRegexp(token2, token3, token4, null) || token.type === TYPES.PUCNTUATOR && !/^(?:--|\+\+|[!.})\]])$/.test(token.value);
  }
  const isMaybeTag = isMaybeRegexp;
  function isTSGeneric(s, idx) {
    for (let q = false, q2 = false, i = idx + 1;i < s.length; i++) {
      if (q2 || (q2 = !/\s/.test(s[i]))) {
        if (s[i] === "," || s[i] === "=")
          return true;
        if (!q && (s[i] === "-" || s[i] === ">"))
          return false;
        if (/\s/.test(s[i]))
          q = true;
        else if (q)
          return /^extends\s$/.test(s.slice(i, i + 8));
      }
    }
    return false;
  }
  function _ERROR_(iam, ...a) {
    throw new Error("jsx2tokens - " + a.join(" ") + ": " + JSON.stringify({ value: iam.source.slice(iam.rangeStart, iam.idx + 1), line: iam.lineStart, column: iam.columnStart, range: iam.rangeStart }));
  }
  function char(iam, offset) {
    return iam.source.charAt(iam.idx + offset);
  }
  function plusLine(iam, force) {
    if (force || char(iam, 1) !== `
`)
      iam.line++, iam.columnDiff = iam.idx + 1;
  }
  function runCallback(iam) {
    if (iam.proxy) {
      iam.isBreakLoop = !!iam.proxy(iam.tokenLast, iam.tokens.length - 1, iam.tokens, iam.proxyCtx);
    }
  }
  function env(iam, _type) {
    if (_type === null)
      iam.__env__.pop();
    else
      _type && iam.__env__.push(_type);
    return iam.ENV = iam.__env__[iam.__env__.length - 1] || "";
  }
  function saveToken(iam, _type) {
    iam.tl4 = iam.tl3;
    iam.tl3 = iam.tl2;
    iam.tl2 = iam.tokenLast;
    iam.tokenLast = {
      deep: iam.deep,
      type: _type,
      value: iam.source.slice(iam.rangeStart, iam.idx + 1)
    };
    const range = [iam.rangeStart, iam.rangeStart = iam.idx + 1];
    const loc = {
      start: { line: iam.lineStart, column: iam.columnStart },
      end: { line: iam.line, column: iam.columnStart = iam.idx - iam.columnDiff + 1 }
    };
    if (iam.loc)
      iam.tokenLast.loc = loc;
    if (iam.range)
      iam.tokenLast.range = range;
    iam.tokens.push(iam.tokenLast);
  }
  function initToken(iam) {
    if (iam.rangeStart < iam.idx) {
      iam.idx--;
      const tokenLastTmp = iam.tokenLast;
      saveToken(iam, TYPES.SPACE);
      if (tokenLastTmp && tokenLastTmp.deep > iam.tokenLast.deep) {
        iam.tokenLast.deep = tokenLastTmp.deep;
      }
      runCallback(iam);
      iam.tokenLast = tokenLastTmp;
      iam.idx++;
    }
    iam.rangeStart = iam.idx;
    iam.lineStart = iam.line;
    iam.columnStart = iam.idx - iam.columnDiff;
    return !iam.isBreakLoop;
  }
  function createPunctuator(iam, offset, type = TYPES.PUCNTUATOR) {
    if (initToken(iam)) {
      if (offset)
        iam.idx += offset;
      tagNameLast(iam);
      saveToken(iam, type);
      runCallback(iam);
    }
  }
  function tagNameLast(iam) {
    if (iam.tokenLast && iam.tokenLast.type === TYPES.JSX_TAG_OPENER_START) {
      iam.tagNameLast = iam.source.slice(iam.rangeStart, iam.idx + 1);
    }
  }
  function _CASE_IDENTIFIER_(iam) {
    if (initToken(iam)) {
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
            case "\r":
            case `
`:
            case "\u2028":
            case "\u2029":
            case "\t":
            case "\v":
            case "\f":
            case " ":
            case " ":
            case "\uFEFF":
            case " ":
            case "᠎":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case " ":
            case "　":
            case "-":
            case "+":
            case '"':
            case "'":
            case "`":
            case "{":
            case "}":
            case "(":
            case ")":
            case "[":
            case "]":
            case ";":
            case ",":
            case "~":
            case ":":
            case "?":
            case "<":
            case "=":
            case ">":
            case "^":
            case "%":
            case "!":
            case "*":
            case "&":
            case "|":
            case ".":
            case "/":
              iam.idx--;
              break LOOP;
            default:
          }
        }
      tagNameLast(iam);
      saveToken(iam, TYPES.IDENTIFIER);
      const token = iam.tokenLast;
      switch (token.value) {
        case "null":
          token.type = TYPES.NULL;
          break;
        case "true":
        case "false":
          token.type = TYPES.BOOLEAN;
          break;
        case "let":
        case "static":
        case "implements":
        case "interface":
        case "package":
        case "private":
        case "protected":
        case "public":
        case "await":
        case "break":
        case "case":
        case "catch":
        case "class":
        case "const":
        case "continue":
        case "debugger":
        case "default":
        case "delete":
        case "do":
        case "else":
        case "enum":
        case "export":
        case "extends":
        case "finally":
        case "for":
        case "function":
        case "if":
        case "import":
        case "in":
        case "instanceof":
        case "new":
        case "return":
        case "super":
        case "switch":
        case "this":
        case "throw":
        case "try":
        case "typeof":
        case "var":
        case "void":
        case "while":
        case "with":
        case "yield":
          token.type = TYPES.KEYWORD;
          break;
        default:
          if (token.value.indexOf("@") > -1) {
            token.type = TYPES.MODIFIER;
          }
      }
      runCallback(iam);
    }
  }
  function _CASE_COMMENT_LINE_(iam) {
    if (initToken(iam)) {
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
            case "\r":
            case `
`:
            case "\u2028":
            case "\u2029":
              iam.idx--;
              break LOOP;
            default:
          }
        }
      const tokenLastTmp = iam.tokenLast;
      saveToken(iam, TYPES.COMMENT_LINE);
      runCallback(iam);
      iam.tokenLast = tokenLastTmp;
    }
  }
  function _CASE_COMMENT_BLOCK_(iam) {
    if (initToken(iam)) {
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
              _ERROR_(iam, TYPES.COMMENT_BLOCK);
              break;
            case "\r":
              plusLine(iam, false);
              break;
            case `
`:
            case "\u2028":
            case "\u2029":
              plusLine(iam, true);
              break;
            case "*":
              if (char(iam, 1) === "/") {
                iam.idx++;
                break LOOP;
              }
              break;
            default:
          }
        }
      const tokenLastTmp = iam.tokenLast;
      saveToken(iam, TYPES.COMMENT_BLOCK);
      runCallback(iam);
      iam.tokenLast = tokenLastTmp;
    }
  }
  function _CASE_STRING_(iam) {
    if (initToken(iam)) {
      let ch0;
      let slashed = 0;
      LOOP:
        for (;; ) {
          if (slashed)
            slashed--;
          iam.idx++;
          switch (ch0 = char(iam, 0)) {
            case "":
              _ERROR_(iam, TYPES.STRING);
              break;
            case "\\":
              if (!slashed)
                slashed = 2;
              break;
            case '"':
            case "'":
              if (!slashed && ch0 === iam.source[iam.rangeStart])
                break LOOP;
              break;
            default:
          }
        }
      saveToken(iam, TYPES.STRING);
      runCallback(iam);
    }
  }
  function _CASE_TEMPLATE_(iam) {
    if (initToken(iam)) {
      let slashed = 0;
      let needDeepPlus = false;
      LOOP:
        for (;; ) {
          if (slashed)
            slashed--;
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
              _ERROR_(iam, TYPES.TEMPLATE);
              break;
            case "\r":
              plusLine(iam, false);
              break;
            case `
`:
            case "\u2028":
            case "\u2029":
              plusLine(iam, true);
              break;
            case "\\":
              if (!slashed)
                slashed = 2;
              break;
            case "`":
              if (!slashed) {
                env(iam, null);
                break LOOP;
              }
              break;
            case "$":
              if (!slashed && char(iam, 1) === "{") {
                iam.idx++;
                needDeepPlus = true;
                break LOOP;
              }
              break;
            default:
          }
        }
      saveToken(iam, TYPES.TEMPLATE);
      if (needDeepPlus)
        iam.deep++;
      const token = iam.tokenLast;
      const first = token.value[0];
      const last = token.value[token.value.length - 1];
      if (first === "`") {
        if (last !== "`")
          token.type = TYPES.TEMPLATE_HEAD;
      } else {
        token.type = last !== "`" ? TYPES.TEMPLATE_MIDDLE : TYPES.TEMPLATE_TAIL;
      }
      runCallback(iam);
    }
  }
  function _CASE_REGULAR_EXPRESSION_(iam) {
    if (initToken(iam)) {
      let rxD = 0;
      let slashed = 0;
      LOOP:
        for (;; ) {
          if (slashed)
            slashed--;
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
            case "\r":
            case `
`:
            case "\u2028":
            case "\u2029":
              _ERROR_(iam, TYPES.REGULAR_EXPRESSION);
              break;
            case "\\":
              if (!slashed)
                slashed = 2;
              break;
            case "[":
              if (!slashed)
                rxD = 1;
              break;
            case "]":
              if (!slashed)
                rxD = 0;
              break;
            case "/":
              if (!slashed && !rxD) {
                for (;; ) {
                  iam.idx++;
                  if (!/\w/.test(char(iam, 0))) {
                    iam.idx--;
                    break LOOP;
                  }
                }
              }
              break;
            default:
          }
        }
      saveToken(iam, TYPES.REGULAR_EXPRESSION);
      runCallback(iam);
    }
  }
  function _CASE_NUMERIC_(iam, nD, nE, nS) {
    if (initToken(iam)) {
      let ch0;
      iam.idx += nS;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (ch0 = char(iam, 0)) {
            case "_":
              if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              nS = 1;
              break;
            case ".":
              if (nD !== 1 && nS)
                _ERROR_(iam, TYPES.NUMERIC);
              if (nD || nE) {
                iam.idx--;
                break LOOP;
              }
              nD = 1;
              nS = 1;
              break;
            case "e":
            case "E":
              if (nE || nS)
                _ERROR_(iam, TYPES.NUMERIC);
              nE = 1;
              nS = 1;
              break;
            case "+":
            case "-":
              if (nE !== 1) {
                iam.idx--;
                break LOOP;
              }
              nE = 2;
              break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              if (nE === 1)
                nE = 2;
              if (nD === 1)
                nD = 2;
              nS = 0;
              break;
            default:
              if (ch0 !== "n")
                iam.idx--;
              if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              break LOOP;
          }
        }
      saveToken(iam, TYPES.NUMERIC);
      runCallback(iam);
    }
  }
  function _CASE_NUMERIC__B(iam) {
    if (initToken(iam)) {
      let nS = 1;
      let ch0;
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (ch0 = char(iam, 0)) {
            case "_":
              if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              nS = 1;
              break;
            case "0":
            case "1":
              nS = 0;
              break;
            default:
              if (ch0 !== "n")
                iam.idx--;
              else if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              break LOOP;
          }
        }
      saveToken(iam, TYPES.NUMERIC);
      runCallback(iam);
    }
  }
  function _CASE_NUMERIC__O(iam) {
    if (initToken(iam)) {
      let nS = 1;
      let ch0;
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (ch0 = char(iam, 0)) {
            case "_":
              if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              nS = 1;
              break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
              nS = 0;
              break;
            default:
              if (ch0 !== "n")
                iam.idx--;
              else if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              break LOOP;
          }
        }
      saveToken(iam, TYPES.NUMERIC);
      runCallback(iam);
    }
  }
  function _CASE_NUMERIC__X(iam) {
    if (initToken(iam)) {
      let nS = 1;
      let ch0;
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (ch0 = char(iam, 0)) {
            case "_":
              if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              nS = 1;
              break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "a":
            case "A":
            case "b":
            case "B":
            case "c":
            case "C":
            case "d":
            case "D":
            case "e":
            case "E":
            case "f":
            case "F":
              nS = 0;
              break;
            default:
              if (ch0 !== "n")
                iam.idx--;
              else if (nS)
                _ERROR_(iam, TYPES.NUMERIC);
              break LOOP;
          }
        }
      saveToken(iam, TYPES.NUMERIC);
      runCallback(iam);
    }
  }
  function _CASE_JSX_TEXT_(iam, forIdx) {
    if (initToken(iam)) {
      let slashed = 0;
      LOOP:
        for (;; ) {
          if (forIdx != null && iam.idx >= forIdx)
            break;
          if (slashed)
            slashed--;
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
              break LOOP;
            case "\r":
              plusLine(iam, false);
              break;
            case `
`:
            case "\u2028":
            case "\u2029":
              plusLine(iam, true);
              break;
            case "\\":
              if (!slashed)
                slashed = 2;
              break;
            case "{":
              if (forIdx == null && !slashed) {
                iam.idx--;
                break LOOP;
              }
              break;
            case "<":
              if (forIdx == null && char(iam, 1).trim()) {
                iam.idx--;
                break LOOP;
              }
              break;
            default:
          }
        }
      saveToken(iam, TYPES.JSX_TEXT);
      runCallback(iam);
    }
  }
  function _CASE_JSX_COMMENT_(iam) {
    if (initToken(iam)) {
      iam.idx++;
      LOOP:
        for (;; ) {
          iam.idx++;
          switch (char(iam, 0)) {
            case "":
              break LOOP;
            case "\r":
              plusLine(iam, false);
              break;
            case `
`:
            case "\u2028":
            case "\u2029":
              plusLine(iam, true);
              break;
            case "-":
              if (char(iam, 1) === "-" && char(iam, 2) === ">") {
                iam.idx += 2;
                break LOOP;
              }
              break;
            default:
          }
        }
      saveToken(iam, TYPES.JSX_COMMENT);
      runCallback(iam);
    }
  }
  function _DEFAULT_LOOP_(iam) {
    let ch0;
    let ch1;
    let ch2;
    LOOP:
      for (;!iam.isBreakLoop; ) {
        iam.idx++;
        ch0 = char(iam, 0);
        switch (iam.ENV) {
          case "%><%":
            switch (ch0) {
              case "":
                break LOOP;
              case "{":
                env(iam, "%jsxexp%");
                createPunctuator(iam, 0, TYPES.JSX_EXPRESSION_START);
                iam.deep++;
                break;
              case "<":
                if (char(iam, 1).trim())
                  iam.idx--, env(iam, "%jsxtag%");
                else
                  _CASE_JSX_TEXT_(iam);
                break;
              default:
                _CASE_JSX_TEXT_(iam);
            }
            break;
          default:
            switch (ch0) {
              case "":
                break LOOP;
              case "\r":
                plusLine(iam, false);
                break;
              case `
`:
              case "\u2028":
              case "\u2029":
                plusLine(iam, true);
                break;
              case "\t":
              case "\v":
              case "\f":
              case " ":
              case " ":
              case "\uFEFF":
              case " ":
              case "᠎":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case " ":
              case "　":
                break;
              case '"':
              case "'":
                _CASE_STRING_(iam);
                break;
              case "`":
                env(iam, "%``%");
                _CASE_TEMPLATE_(iam);
                break;
              case "0":
                switch (char(iam, 1)) {
                  case "b":
                  case "B":
                    _CASE_NUMERIC__B(iam);
                    break;
                  case "o":
                  case "O":
                    _CASE_NUMERIC__O(iam);
                    break;
                  case "x":
                  case "X":
                    _CASE_NUMERIC__X(iam);
                    break;
                  case ".":
                    _CASE_NUMERIC_(iam, 1, 0, 1);
                    break;
                  case "e":
                  case "E":
                    _CASE_NUMERIC_(iam, 0, 1, 1);
                    break;
                  default:
                    _CASE_NUMERIC_(iam, 0, 0, 0);
                }
                break;
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
              case "8":
              case "9":
                _CASE_NUMERIC_(iam, 0, 0, 0);
                break;
              case ".":
                switch (ch1 = char(iam, 1)) {
                  case "0":
                  case "1":
                  case "2":
                  case "3":
                  case "4":
                  case "5":
                  case "6":
                  case "7":
                  case "8":
                  case "9":
                    _CASE_NUMERIC_(iam, 1, 0, 0);
                    break;
                  default:
                    createPunctuator(iam, ch1 === ch0 && char(iam, 2) === ch0 ? 2 : 0);
                }
                break;
              case "{":
                env(iam, "%{}%");
                createPunctuator(iam, 0);
                iam.deep++;
                break;
              case "}":
                switch (iam.ENV) {
                  case "%``%":
                    iam.deep--;
                    _CASE_TEMPLATE_(iam);
                    break;
                  case "%{}%":
                    iam.deep--;
                    env(iam, null);
                    createPunctuator(iam, 0);
                    break;
                  case "%jsxexp%":
                    iam.deep--;
                    env(iam, null);
                    createPunctuator(iam, 0, TYPES.JSX_EXPRESSION_END);
                    break;
                  default:
                    _ERROR_(iam, 'Bracket "}"');
                }
                break;
              case "(":
                env(iam, "%()%");
                createPunctuator(iam, 0);
                iam.deep++;
                break;
              case ")":
                switch (iam.ENV) {
                  case "%()%":
                    iam.deep--;
                    env(iam, null);
                    createPunctuator(iam, 0);
                    break;
                  default:
                    _ERROR_(iam, 'Bracket ")"');
                }
                break;
              case "[":
                env(iam, "%[]%");
                createPunctuator(iam, 0);
                iam.deep++;
                break;
              case "]":
                switch (iam.ENV) {
                  case "%[]%":
                    iam.deep--;
                    env(iam, null);
                    createPunctuator(iam, 0);
                    break;
                  default:
                    _ERROR_(iam, 'Bracket "]"');
                }
                break;
              case ";":
              case ",":
              case "~":
              case ":":
                createPunctuator(iam, 0);
                break;
              case "^":
              case "%":
                createPunctuator(iam, char(iam, 1) !== "=" ? 0 : 1);
                break;
              case "!":
                createPunctuator(iam, char(iam, 1) !== "=" ? 0 : char(iam, 2) !== "=" ? 1 : 2);
                break;
              case "+":
              case "-":
                createPunctuator(iam, (ch1 = char(iam, 1)) === "=" || ch1 === ch0 ? 1 : 0);
                break;
              case "?":
                createPunctuator(iam, (ch1 = char(iam, 1)) !== ch0 ? 0 : char(iam, 2) !== "=" ? 1 : 2);
                break;
              case "*":
              case "&":
              case "|":
                createPunctuator(iam, (ch1 = char(iam, 1)) === "=" ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== "=" ? 1 : 2);
                break;
              case "=":
                createPunctuator(iam, (ch1 = char(iam, 1)) === ">" ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== ch0 ? 1 : 2);
                break;
              case "<":
                ch1 = char(iam, 1);
                if (iam.useJSX && (iam.ENV === "%jsxtag%" && ~env(iam, null) || ch1 === "/" && iam.ENV[0] === "%script%" && (char(iam, 2) === ">" || iam.source.slice(iam.idx + 2, iam.idx + 2 + iam.ENV[1].length) === iam.ENV[1]) || isMaybeTag(iam.tokenLast, iam.tl2, iam.tl3, iam.tl4) && !isTSGeneric(iam.source, iam.idx))) {
                  if (!ch1.trim())
                    createPunctuator(iam, 0);
                  else if (ch1 === "!" && char(iam, 2) === "-" && char(iam, 3) === "-") {
                    _CASE_JSX_COMMENT_(iam);
                  } else if (ch1 === "/" && !/[/*]/.test(char(iam, 2))) {
                    if (iam.ENV === "%><%" || iam.ENV[0] === "%script%")
                      env(iam, null), iam.deep--;
                    createPunctuator(iam, 1, TYPES.JSX_TAG_CLOSER_START);
                    env(iam, "%</>%");
                    iam.deep++;
                  } else {
                    createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_START);
                    iam.tagNameLast = "";
                    env(iam, "%<>%");
                    iam.deep++;
                  }
                } else {
                  createPunctuator(iam, (ch1 = char(iam, 1)) === "=" ? 1 : ch1 !== ch0 ? 0 : char(iam, 2) !== "=" ? 1 : 2);
                }
                break;
              case ">":
                switch (iam.ENV) {
                  case "%<>%":
                    env(iam, null);
                    if (iam.tagNameLast === "script") {
                      iam.deep--;
                      createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END);
                      iam.deep++;
                      if (iam.parseScriptTags) {
                        env(iam, ["%script%", iam.tagNameLast]);
                      } else {
                        env(iam, "%><%");
                        if (iam.skipScriptTags) {
                          const last = iam.source.indexOf("</script>", iam.idx);
                          if (last < 0)
                            _ERROR_(iam, "script");
                          iam.idx++, _CASE_JSX_TEXT_(iam, last - 1);
                        }
                      }
                      break;
                    }
                    if (iam.tagNameLast === "style") {
                      iam.deep--;
                      createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END);
                      iam.deep++;
                      env(iam, "%><%");
                      if (iam.skipStyleTags) {
                        const last = iam.source.indexOf("</style>", iam.idx);
                        if (last < 0)
                          _ERROR_(iam, "style");
                        iam.idx++, _CASE_JSX_TEXT_(iam, last - 1);
                      }
                      break;
                    }
                    if (/^[!?%]/.test(iam.tagNameLast) || iam.considerChildlessTags && isChildlessTagName(iam.tagNameLast)) {
                      iam.deep--;
                      createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END_CHILDLESS);
                    } else {
                      iam.deep--;
                      createPunctuator(iam, 0, TYPES.JSX_TAG_OPENER_END);
                      iam.deep++;
                      env(iam, "%><%");
                    }
                    break;
                  case "%</>%":
                    iam.deep--;
                    env(iam, null);
                    createPunctuator(iam, 0, TYPES.JSX_TAG_CLOSER_END);
                    break;
                  default:
                    createPunctuator(iam, (ch1 = char(iam, 1)) === "=" ? 1 : ch1 !== ch0 ? 0 : (ch2 = char(iam, 2)) === "=" ? 2 : ch2 !== ch0 ? 1 : char(iam, 3) !== "=" ? 2 : 3);
                }
                break;
              case "/":
                switch (ch1 = char(iam, 1)) {
                  case "/":
                    _CASE_COMMENT_LINE_(iam);
                    break;
                  case "*":
                    _CASE_COMMENT_BLOCK_(iam);
                    break;
                  default:
                    if (iam.ENV[1] === "<" && ch1 === ">") {
                      iam.deep--;
                      env(iam, null);
                      createPunctuator(iam, 1, iam.ENV[2] !== "/" ? TYPES.JSX_TAG_OPENER_END_CHILDLESS : TYPES.JSX_TAG_CLOSER_END);
                    } else if (isMaybeRegexp(iam.tokenLast, iam.tl2, iam.tl3, iam.tl4)) {
                      _CASE_REGULAR_EXPRESSION_(iam);
                    } else {
                      createPunctuator(iam, ch1 === "=" ? 1 : 0);
                    }
                }
                break;
              default:
                _CASE_IDENTIFIER_(iam);
            }
            break;
        }
      }
    initToken(iam);
  }
  return function(_source, {
    loc = false,
    range = false,
    strict = true,
    useJSX = true,
    insideJSX = false,
    skipStyleTags = false,
    skipScriptTags = false,
    parseScriptTags = false,
    considerChildlessTags = false,
    proxyCtx = {},
    proxy = undefined
  } = {}) {
    const ENV = useJSX && insideJSX ? "%><%" : "";
    const iam = {
      source: _source,
      isBreakLoop: false,
      proxy,
      proxyCtx,
      loc,
      range,
      useJSX,
      skipStyleTags,
      skipScriptTags,
      parseScriptTags,
      considerChildlessTags,
      tokens: [],
      tokenLast: null,
      tl2: null,
      tl3: null,
      tl4: null,
      tagNameLast: "",
      idx: -1,
      line: 1,
      lineStart: 1,
      deep: 0,
      columnDiff: 0,
      rangeStart: 0,
      columnStart: 0,
      ENV,
      __env__: [ENV]
    };
    _DEFAULT_LOOP_(iam);
    iam.isBreakLoop || strict && iam.deep && _ERROR_(iam, "deep");
    return iam.tokens;
  };
}();

// src/vdom.ts
function createElement(type) {
  return {
    type,
    props: {},
    children: [],
    dom: null
  };
}
function createTextNode(text) {
  return {
    type: "text",
    props: { text },
    children: [],
    dom: null
  };
}
function tokensToVDOM(tokens) {
  const root = createElement("ROOT");
  const stack = [root];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token?.type === TYPES.JSX_TAG_OPENER_START) {
      const tagNameToken = tokens[++i];
      const el = createElement(tagNameToken.value);
      i++;
      while (tokens[i] && tokens[i]?.type !== TYPES.JSX_TAG_OPENER_END && tokens[i]?.type !== TYPES.JSX_TAG_OPENER_END_CHILDLESS) {
        const attr = tokens[i];
        if (attr?.type === TYPES.IDENTIFIER) {
          const key = attr.value;
          const next = tokens[i + 1];
          if (next?.type === TYPES.STRING) {
            el.props[key] = next.value;
            i += 2;
            continue;
          }
          if (next?.type === TYPES.JSX_EXPRESSION_START) {
            let expr = "";
            i += 2;
            while (tokens[i]?.type !== TYPES.JSX_EXPRESSION_END) {
              expr += tokens[i]?.value;
              i++;
            }
            el.props[key] = expr;
            i++;
            continue;
          }
          el.props[key] = true;
        }
        i++;
      }
      stack[stack.length - 1]?.children.push(el);
      if (tokens[i]?.type === TYPES.JSX_TAG_OPENER_END_CHILDLESS) {
        i++;
        continue;
      }
      stack.push(el);
      i++;
      continue;
    }
    if (token?.type === TYPES.JSX_TAG_CLOSER_START) {
      stack.pop();
      i += 2;
      continue;
    }
    if (token?.type === TYPES.JSX_TEXT) {
      stack[stack.length - 1]?.children.push(createTextNode(token.value));
      i++;
      continue;
    }
    i++;
  }
  return root;
}

// src/dom/mount.ts
function mount(v) {
  if (v.type === "text") {
    return document.createTextNode(v.props.text);
  } else {
    const el = document.createElement(v.type);
    for (let prop in v.props) {
      if (prop === "children") {
        v.props[prop].forEach((child) => {
          el.appendChild(mount(child));
        });
      } else {
        el[prop] = v.props[prop];
      }
    }
    for (let child of v.children) {
      el.appendChild(mount(child));
    }
    return el;
  }
}

// public/main.ts
var jsx = `
<div className="card">
  <h1>Hello from browser</h1>
  <p>This is client-side rendered</p>
</div>
`;
var tokens = jsx2tokens(jsx);
var vdom = tokensToVDOM(tokens);
var container = document.getElementById("app");
container?.appendChild(mount(vdom));
