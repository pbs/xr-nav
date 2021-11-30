# xr-nav
A demo/sandbox for exploring same-origin navigation between WebXR immersive experiences.

This is a boiler plate for generating minimal WebXR scenes using Babylon.js and makes use of the `sessiongranted` event fired by a browser's `XRSystem` (`navigator.xr`) to maintain immersive sessions during same origin URL changes.

This project consists of a "hub" world, a red world, and a blue world. The hub world contains links to both the red and blue worlds, while the red and blue worlds contain links back to the hub world.

To generate each world, simply update the reference to the script file on line 28 of `index.html` in the root of this project and run `npm run build`. For example, if you want to build the "red world", update line 28 to be:
```html
<script type="module" src="./src/red.ts"></script>
```
