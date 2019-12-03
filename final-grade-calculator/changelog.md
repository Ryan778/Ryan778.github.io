# Changelog: Final Grade Calculator
As of right now, the source code for FGC is fully available but is not fully open-source. However, core.js can be used under [GPLv3](https://www.gnu.org/licenses/) if you desire to do so. While not required, it would be really appreciated if I knew in advance of what you were doing with this. Thanks!

All notable changes are documented within this file. 
*On a side note, this happens to be the first changelog written in a Markdown file and not a text file, making it **so** much easier to read.*

## [1.0.0] - 2019-12-2
### New
- Support for unweighted grades (no test replacement policies, as that wouldn't make sense)
- Support for test grade calculator (rather than final) - in other words, for any category that already has assignments (though "test" is the most common; who uses a grade calculator for homework?)
- Dark mode, which is automatically enabled when indicated from system settings and/or it's between 11pm and 5am; can also be toggled with a switch on the top right corner
- Test curving, w/ three curves: curve to highest score, square root curve, and nth root curve; compatible with everything 
- Info boxes on the top (e.g., "v1.0.0 is out!") are now dismissible, and can be shown again with an option in the footer

### Changed
- Refactored a lot of code, and it's quite a bit cleaner now
- Improved some of the messages given along with the grade needed (e.g., "You can do it!") to be more suitable
- Updated the "questions that aren't frequently asked" section to reflect changes

## [0.1.2] - 2018-5-12
**BETA BUILD**
### Changed
- Somewhat improved SEO, brushed up certain parts of the "FAQ"
- Moved notices to load after the rest of the page has loaded

## [0.1.1] - 2018-5-2
**BETA BUILD**
### New
- Warning for using letter grades (about how they're less accurate)
- Added a message in output box asking for feedback
- Added basic analytics

### Changed
- Background is now a lighter shade of blue
- Tests taken will now reject non-positive numbers (<=0) instead of giving a warning
- Result box will now auto-hide when the test adjustment policy or the "what you want to find" box is changed

### Bug Fixes
- More Info box will no longer show up under the "I already took the test/final" category as no additional info is given

## [0.1.0] - 2018-4-28
**ALPHA BUILD**
### New
- Initial Version
 - Calculates what one needs for their final grades, currently only supporting weighted grades. 
 - Supports test/grade adjustment policies, specifically "lowest test dropped", "difference between final and lowest test", and "half of the difference between final and lowest test". 