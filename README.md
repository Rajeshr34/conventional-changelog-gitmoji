# Conventional Changelog Gitmoji Preset

**Heads up! This is an opinionated conventional changelog preset used by our internal tech team. We hope you'll find it usefull!**

Are you using [gitmoji library](https://gitmoji.carloscuesta.me/) as a convention for your commit messages ? Then you will love this [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) preset ! It will help you generate a full featured changelog (with scope support).

*Note: You can't use the full conventional-changelog-config spec with this package.*

Found a bug? Have an idea? Feel free to post an [issue](https://github.com/onedior/conventional-changelog-gitmoji/issues) or submit a [PR](https://github.com/onedior/conventional-changelog-gitmoji/pulls).

## Determining the recommended bump

The following bump levels are applied in order of importance.

### major

At least one breaking change is introduce, therefore if a commit contains the emoji:
* :boom: `:boom:`

### minor

At least one new feature is introduce, therefore if a commit contains the emoji:
* :sparkles: `:sparkles:`

### patch

Only fixes are applied, where none of the above rules applies.


## Credits

Based on [louich](https://github.com/louich/conventional-changelog-gitmoji)'s previous work (kudos!) and the fabulous [Gitmoji](https://gitmoji.carloscuesta.me/) icon library.
