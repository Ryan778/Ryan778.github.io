# Changelog: Final Grade Calculator
As of right now, the source code for FGC is fully available but is not fully open-source. However, it can be used under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode) if you desire to do so. While not required, it would be really appreciated if I knew in advance of what you were doing with this. Thanks!

All notable changes are documented within this file. 
*On a side note, this happens to be the first changelog written in a Markdown file and not a text file, making it **so** much easier to read.*

## [0.1.1] - 2018-5-2
**BETA BUILD**
### New
- Warning for using letter grades (about how they're less accurate)
- Added a message in output box asking for feedback
- Added basic analytics

### Changed
- *Bug Fix* More Info box will no longer show up under the "I already took the test/final" category as no additional info is given
- Background is now a lighter shade of blue
- Tests taken will now reject non-positive numbers (<=0) instead of giving a warning
- Result box will now auto-hide when the test adjustment policy or the "what you want to find" box is changed

## [0.1.0] - 2018-4-28
**BETA BUILD**
### New
- Initial Version
 - Calculates what one needs for their final grades, currently only supporting weighted grades. 
 - Supports test/grade adjustment policies, specifically "lowest test dropped", "difference between final and lowest test", and "half of the difference between final and lowest test". 