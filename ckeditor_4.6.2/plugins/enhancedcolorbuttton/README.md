# Enhanced Color Button

Enhanced Color Button is a CKEditor's plugin developed based on
Color Button plugin (version 4.5.8 released on March 31, 2016) provided by
CKSource team and it introduces additional features in addition to Color Button.
Source code of `Color Button` plugin was copied and modified in this plugin for giving user convenience. Changes are elaborated in (Changes.md)[Changes.md] file.

## New Features

* New Quick Apply Button

  User can apply font color and background color of font through one click.

* Indicator of current used color

  Toolbar icons show a color lastly used by user for easy use of Quick Apply Button.

## Installation

To use this plugin, "colorbutton" plugin should be removed first.
Then, follow below steps.

1. Copy whole `enhancedcolorbutton` plugin folder into `./plugins` folder of CKEditor.
2. Add below line into `config.js` file.

```js
config.removePlugins = 'colorbutton';
config.extraPlugins = 'enhancedcolorbutton';
```

## Changelog

Refer to this link, [CHANGES](CHANGES.md).

## Software License Agreement

Please refer to this link, [LICENSE](LICENSE.md).
