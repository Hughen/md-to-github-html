"use strict";

/**
 * emojiRegex
 * Returns the emoji regex value.
 *
 * @name regexEmoji
 * @function
 * @return {RegExp} The emoji regex.
 */
function regexEmoji () {
    return /:([a-z0-9_\+\-]+):/g;
};

/**
 * matchAll
 * Get all the matches for a regular expression in a string.
 *
 * @name matchAll
 * @function
 * @param {String} s The input string.
 * @param {RegExp} r The regular expression.
 * @return {Object} An object containing the following fields:
 *
 *  - `input` (String): The input string.
 *  - `regex` (RegExp): The regular expression.
 *  - `next` (Function): Get the next match.
 *  - `toArray` (Function): Get all the matches.
 *  - `reset` (Function): Reset the index.
 */
function matchAll (s, r) {
    return {
        input: s
      , regex: r

        /**
         * next
         * Get the next match in single group match.
         *
         * @name next
         * @function
         * @return {String|null} The matched snippet.
         */
      , next () {
            let c = this.nextRaw()
            if (c) {
                for (let i = 1; i < c.length; i++) {
                    if (c[i]) {
                        return c[i]
                    }
                }
            }
            return null
        }

        /**
         * nextRaw
         * Get the next match in raw regex output. Usefull to get another group match.
         *
         * @name nextRaw
         * @function
         * @returns {Array|null} The matched snippet
         */
      , nextRaw () {
            let c = this.regex.exec(this.input)
            return c
        }

        /**
         * toArray
         * Get all the matches.
         *
         * @name toArray
         * @function
         * @return {Array} The matched snippets.
         */
      , toArray () {
            let res = []
              , c = null


            while (c = this.next()) {
                res.push(c)
            }

            return res
        }

        /**
         * reset
         * Reset the index.
         *
         * @name reset
         * @function
         * @param {Number} i The new index (default: `0`).
         * @return {Number} The new index.
         */
      , reset (i) {
            return this.regex.lastIndex = i || 0
        }
    }
};

/**
 * RegexEscape
 * Escapes a string for using it in a regular expression.
 *
 * @name RegexEscape
 * @function
 * @param {String} input The string that must be escaped.
 * @return {String} The escaped string.
 */
function RegexEscape(input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * proto
 * Adds the `RegexEscape` function to `RegExp` class.
 *
 * @name proto
 * @function
 * @return {Function} The `RegexEscape` function.
 */
RegexEscape.proto = function () {
    RegExp.escape = RegexEscape;
    return RegexEscape;
};

const noop6 = function() {};

(function () {
    const NAME_FIELD = "name";

    if (typeof noop6.name === "string") {
        return;
    }

    try {
        Object.defineProperty(Function.prototype, NAME_FIELD, {
            get: function () {
                var nameMatch = this.toString().trim().match(/^function\s*([^\s(]+)/);
                var name = nameMatch ? nameMatch[1] : "";
                Object.defineProperty(this, NAME_FIELD, { value: name });
                return name;
            }
        });
    } catch (e) {}
})();

/**
 * functionName
 * Get the function name.
 *
 * @name functionName
 * @function
 * @param {Function} input The input function.
 * @returns {String} The function name.
 */
function functionName (input) {
    return input.name;
};

/**
 * Typpy
 * Gets the type of the input value or compares it
 * with a provided type.
 *
 * Usage:
 *
 * ```js
 * Typpy({}) // => "object"
 * Typpy(42, Number); // => true
 * Typpy.get([], "array"); => true
 * ```
 *
 * @name Typpy
 * @function
 * @param {Anything} input The input value.
 * @param {Constructor|String} target The target type.
 * It could be a string (e.g. `"array"`) or a
 * constructor (e.g. `Array`).
 * @return {String|Boolean} It returns `true` if the
 * input has the provided type `target` (if was provided),
 * `false` if the input type does *not* have the provided type
 * `target` or the stringified type of the input (always lowercase).
 */
function Typpy(input, target) {
    if (arguments.length === 2) {
        return Typpy.is(input, target);
    }
    return Typpy.get(input, true);
}

/**
 * Typpy.is
 * Checks if the input value has a specified type.
 *
 * @name Typpy.is
 * @function
 * @param {Anything} input The input value.
 * @param {Constructor|String} target The target type.
 * It could be a string (e.g. `"array"`) or a
 * constructor (e.g. `Array`).
 * @return {Boolean} `true`, if the input has the same
 * type with the target or `false` otherwise.
 */
Typpy.is = function (input, target) {
    return Typpy.get(input, typeof target === "string") === target;
};

/**
 * Typpy.get
 * Gets the type of the input value. This is used internally.
 *
 * @name Typpy.get
 * @function
 * @param {Anything} input The input value.
 * @param {Boolean} str A flag to indicate if the return value
 * should be a string or not.
 * @return {Constructor|String} The input value constructor
 * (if any) or the stringified type (always lowercase).
 */
Typpy.get = function (input, str) {

    if (typeof input === "string") {
        return str ? "string" : String;
    }

    if (null === input) {
        return str ? "null" : null;
    }

    if (undefined === input) {
        return str ? "undefined" : undefined;
    }

    if (input !== input) {
        return str ? "nan" : NaN;
    }

    return str ? input.constructor.name.toLowerCase() : input.constructor;
};

/**
 * iterateObject
 * Iterates an object. Note the object field order may differ.
 *
 * @name iterateObject
 * @function
 * @param {Object} obj The input object.
 * @param {Function} fn A function that will be called with the current value, field name and provided object.
 * @return {Function} The `iterateObject` function.
 */
function iterateObject(obj, fn) {
    var i = 0
      , keys = []
      ;

    if (Array.isArray(obj)) {
        for (; i < obj.length; ++i) {
            if (fn(obj[i], i, obj) === false) {
                break;
            }
        }
    } else if (typeof obj === "object" && obj !== null) {
        keys = Object.keys(obj);
        for (; i < keys.length; ++i) {
            if (fn(obj[keys[i]], keys[i], obj) === false) {
                break;
            }
        }
    }
}

/**
 * barbe
 * Renders the input template including the data.
 *
 * @name barbe
 * @function
 * @param {String} text The template text.
 * @param {Array} arr An array of two elements: the first one being the start snippet (default: `"{"`) and the second one being the end snippet (default: `"}"`).
 * @param {Object} data The template data.
 * @return {String} The rendered template.
 */
function barbe(text, arr, data) {
    if (!Array.isArray(arr)) {
        data = arr;
        arr = ["{", "}"];
    }

    if (!data || data.constructor !== Object) {
        return text;
    }

    arr = arr.map(RegexEscape);

    let deep = (obj, path) => {
        iterateObject(obj, (value, c) => {
            path.push(c);
            if (Typpy(value, Object)) {
                deep(value, path);
                path.pop();
                return;
            }
            text = text.replace(
                new RegExp(arr[0] + path.join(".") + arr[1], "gm")
              , Typpy(value, Function) ? value : String(value)
            );
            path.pop();
        });
    };

    deep(data, []);

    return text;
}

/**
 * emojer
 * Replaces the `:emoji:` snippets in the input string with the specified template.
 *
 * The `__EMOJI_NAME__` snippets in the template will be replaced with the emoji names.
 *
 * @name emojer
 * @function
 * @param {String} message The input string containing `:emoji:`.
 * @param {String} template The template to be used for replacing the `:emoji:` icons.
 * @param {String} supportedEmojis A map of supported emoji names and truly values (e.g. `{ heart: true }`)
 * @return {String} The result string.
 */
function emojer (message, template, supportedEmojis) {
    let emojis = matchAll(message, regexEmoji()).toArray();
    let objEmojis = {};

    emojis.forEach(supportedEmojis ? c => {
        if (!supportedEmojis[c]) { return }
        objEmojis[c] = barbe(
            template, ["__", "__"],
            { EMOJI_NAME: c, EMOJI_SRC: supportedEmojis[c] }
        );
    } : c => {
        objEmojis[c] = barbe(template, ["__", "__"], { EMOJI_NAME: c });
    });

    return barbe(message, [":", ":"], objEmojis);
};
