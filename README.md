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
-   [x] hover tooltip support
-   [ ] select A vs B in popup
-   [x] paginate intro pages
-   [x] update font
-   [x] new topbar - no images, text only
-   [x] include fuel and health in topbar
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

-   [x] enemies + health/damage
-   [x] overworld scan

### Other

-   [ ] event upgrade support
-   [ ] area map wall/corner rotation
-   [x] connect caverns in area map
-   [x] overworld scene loads slowly - only happens when debug info is on (apparently text very renders slowly when wrapped)
-   [ ] add toast and sound when you pick up an item
-   [x] don't spawn resources on walls
-   [ ] create and implement unique home base tile
-   [x] fix line artifacts in exploration areas
-   [ ] rotate tiles in exploration areas properly
-   [ ] add statement pieces to exploration areas
-   [ ] implement special map event sound
-   [ ] implement portraits and textboxes for crew requests
-   [x] add transitions between scenes to slow it down a bit and make it feel more polished
-   [ ] hit targets are wrong for buttons
-   [ ] when you hit explore on the central tile it ends the day
-   [ ] Music doesn’t start on main page until you click the canvas
-   [ ] Music doesn’t continue once you click “Start” on main page
-   [ ] Text in intro page 1 should be vertically centered.
-   [ ] Text in intro page 3, “Will humanity survive” needs to be bigger font and centered
-   [ ] Intro page 3, button should say “BEGIN” instead of “NEXT” and button should be centered below “will humanity survive”
-   [ ] fade in base-bg, and then wait a second before fading in the text overlay. otherwise they will never see the base bg.
-   [ ] update overlay’s layout
-   [ ] tutorials should have new UI elements and should be centered on the page so they have to read before they can interact. (i know, i changed my mind on this)
-   [ ] top bar should have new UI applied
-   [ ] “explore” shouldn’t show up on first tile
-   [ ] “end day” should be at bottom right
-   [ ] “scan” shouldn’t be available on home tile
-   [ ] home tile should always be forest if possible (since bg is forest)
-   [ ] hover overlays on tiles (the blue outline) should be at about 75% transparency
-   [ ] sometimes biome bg doesn’t match tile biome
-   [ ] wetlands biome resource spawning is too high
-   [ ] tile rotation is incorrect (spaces should only be facing outward)
-   [ ] lines still appearing on map
-   [ ] when you walk over a resource we should show a small box “Picked up [item name]”
-   [ ] in exploration “Leave” should be bottom right
-   [ ] desert music isn’t playing properly at all
-   [ ] can we blink the number once n the top bar when we add an item to it?
-   [ ] music doesn’t restart when we go back to the overworld
-   [ ] nighttime needs to have the same transitioning that morning has
