# password-validator-nodejs

Simple password validator using raw entropy values. Heavily inspired by Lane Wagner [Lane Wagner](https://github.com/wagslane) repository [go-password-validator](https://github.com/wagslane/go-password-validator).

## Motivation

[go-password-validator](https://github.com/wagslane/go-password-validator) is an awesome project written for Go Lang. But I wondered what about Javascript community?

[Zxcvbn](https://github.com/dropbox/zxcvbn) is a great tool with the same functionality, but it requires dataset of most commonly used passwords.

This project can be used to front a password strength meter, or simply validate password strength on the server. Benefits:

- No stupid rules (doesn't require uppercase, numbers, special characters, etc)
- Everything is based on entropy (raw cryptographic strength of the password)
- Doesn't load large sets of data into memory - very fast and lightweight
- Doesn't contact any API's or external systems
- Inspired by this [XKCD](https://xkcd.com/936/)

![XKCD Passwords](https://imgs.xkcd.com/comics/password_strength.png)

## ⚙️ Installation

Outside of a Go module:

```bash
npm i password-validator-nodejs
```

## 🚀 Quick Start

```javascript
package main

const passwordvalidator = require("password-validator-nodejs")

const estimatePasswordStrength = (password, minEntropy) {
    entropy := passwordvalidator.passwordValidator("password", minEntropy)
    // if the password has enough entropy, {"}
    // otherwise, a formatted error message is provided explaining
    // how to increase the strength of the password
    // (safe to show to the client)
}
```

## What Entropy Value Should I Use?

It's up to you. That said, here is a graph that shows some common timings for different values, somewhere in the 50-70 range seems "reasonable".

Keep in mind that attackers likely aren't just brute-forcing passwords, if you want protection against common passwords or [PWNed passwords](https://haveibeenpwned.com/) you'll need to do additional work. This library is lightweight, doesn't load large datasets, and doesn't contact external services.

![entropy](https://external-preview.redd.it/rhdADIZYXJM2FxqNf6UOFqU5ar0VX3fayLFpKspN8uI.png?auto=webp&s=9c142ebb37ed4c39fb6268c1e4f6dc529dcb4282)

## How It Works

First, we determine the "base" number. The base is a sum of the different "character sets" found in the password.

We've _arbitrarily_ chosen the following character sets:

- 26 lowercase letters
- 26 uppercase letters
- 10 digits
- 5 replacement characters - `!@$&*`
- 5 seperator characters - `_-., `
- 22 less common special characters - `"#%'()+/:;<=>?[\]^{|}~`

Using at least one character from each set your base number will be 94: `26+26+10+5+5+22 = 94`

Every unique character that doesn't match one of those sets will add `1` to the base.

If you only use, for example, lowercase letters and numbers, your base will be 36: `26+10 = 36`.

After we have calculated a base, the total number of brute-force-guesses is found using the following formulae: `base^length`

A password using base 26 with 7 characters would require `26^7`, or `8031810176` guesses.

Once we know the number of guesses it would take, we can calculate the actual entropy in bits using `log2(guesses)`. That calculation is done in log space in practice to avoid numeric overflow.

### Additional Safety

We try to err on the side of reporting _less_ entropy rather than _more_.

#### Same Character

With repeated characters like `aaaaaaaaaaaaa`, or `111222`, we modify the length of the sequence to count as no more than `2`.

- `aaaa` has length 2
- `111222` has length 4

#### Common Sequences

Common sequences of length three or greater count as length `2`.

- `12345` has length 2
- `765432` has length 2
- `abc` has length 2
- `qwerty` has length 2

The sequences are checked from back->front and front->back. Here are the sequences we've implemented so far, and they're case-insensitive:

- `0123456789`
- `qwertyuiop`
- `asdfghjkl`
- `zxcvbnm`
- `abcdefghijklmnopqrstuvwxyz`

## Not ZXCVBN

There's another project that has a similar purpose, [zxcvbn](https://github.com/dropbox/zxcvbn), and you may want to check it out as well. Our goal is not to be zxcvbn, because it's already good at what it does. `password-validator-nodejs` doesn't load any large datasets of real-world passwords, we write simple rules to calculate an entropy score. It's up to the user of this library to decide how to use that entropy score, and what scores constitute "secure enough" for their application.

Submit an issue (above in the issues tab)

## Transient Dependencies

None! And it will stay that way, except of course for the standard library.
