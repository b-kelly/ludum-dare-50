# ludum-dare-50

Play here: https://b-kelly.github.io/ludum-dare-50/

## Initial setup

> npm i

## Local dev

> npm start

Your browser will automatically open to the correct page. Any changes made to source will auto-refresh your browser.

If using VS Code, install the extensions under "Recommended". The project is preconfigured to autoformat and lint on file save.

## Deployment

> npm run build

Ensure GitHub pages is enabled for your repository. The project will autobuild and deploy to the `gh-pages` branch.

## TODO List

### New UI

-   [x] tutorial / popup support
-   [ ] hover tooltip support
-   [ ] select A vs B in popup
-   [x] paginate intro pages
-   [x] update font
-   [x] new topbar - no images, text only
-   [ ] include fuel and health in topbar
-   [ ] button hover/active/disabled states

### Events

-   [x] load events.json
-   [x] biome specific event filters
-   [x] colony progress based event filters
-   [x] specific event for specific day
-   [x] split daily events morning/night message
-   [x] resource condition event filters
-   [ ] daily event pass/fail support

### Mechanics

-   [ ] enemies + health/damage
-   [x] overworld scan

### Other

-   [ ] event upgrade support
-   [ ] area map wall/corner rotation
-   [ ] connect caverns in area map
-   [x] overworld scene loads slowly
-   only happens when debug info is on (apparently text very renders slowly when wrapped)
-   [ ] add toast and sound when you pick up an item
-   [x] don't spawn resources on walls
-   [ ] create and implement unique home base tile
-   [ ] fix line artifacts in exploration areas
-   [ ] rotate tiles in exploration areas properly
-   [ ] add statement pieces to exploration areas
-   [ ] implement special map event sound
-   [ ] implement portraits and textboxes for crew requests
-   [x] add transitions between scenes to slow it down a bit and make it feel more polished
