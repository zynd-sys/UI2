# UI2 (in development)  [![npm version](https://badge.fury.io/js/ui2.svg)](https://www.npmjs.com/package/ui2)

[![example workflow](https://github.com/zynd-sys/UI2/actions/workflows/testing.yml/badge.svg)](https://github.com/zynd-sys/UI2/actions/workflows/testing.yml)

Library for creating user interfaces. Has a declarative syntax. Written in [Typescript](https://www.typescriptlang.org). Inspired by [SwiftUI](https://developer.apple.com/xcode/swiftui/).

```Typescript
class HelloWorldView extends View {
	protected content = () =>
	VStack(
		Texts('Hello world')
			.tagName('h1')
			.bold()
	)
}

App.useManifest(
	new ManifestItem(PathType.root, '', HelloWorldView)
)
```

## Installation

To install the latest stable version:

```Bash
npm i ui2
```

## Elements

All elements have minimal styling, and are not browser dependent. Each element has modifiers that modify that element in some way, or only its own descendants. Modifiers are divided into general and specific (suitable only for this element).

When creating elements, great importance is placed on accessibility. For example, if the user prefers reduced motion, then the animation will not play. Elements will attempt to conform to text directions (using the [CSS Logical Properties(MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) specification), the `transform` exception and based on it animation.

* `View` is an abstract class that represents part of your application's user interface. Can track data changes (using the `@State` decorator) and redraw the content when the data is updated (the redraw happens after the rest of the code is executed)
* `Stack` is an element for placing children along a certain direction axis. Can modify HTML tag (default `<div>`)
* `NavigationLink` - element for internal navigation, accepts `View` or `LinkPathClass` (description in navigation section)
* `Texts` is an element for displaying strings, numbers and `Date`. Numbers and `Date` are converted to strings using [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). Can change HTML tag (default `<p>`)
* `Picture` - element for displaying images
* `Link` - element for external navigation
* `TextStack` - an element for displaying non-text elements in a text block. Works slower than `Texts`. Can change HTML tag (default `<p>`)
* `Iframe` - element for embedding other Web pages
* `ForEach` - element for creating dynamic lists, takes data into account when placing elements
* `Divider` - an element for separating other elements, can be in the form of a dividing line or a space-occupying transparent separator
* `Button` — button element, can accept click handlers. Handlers can be a function or special objects (`ShareButton` or `PaymentRequest`). The library safely adds Api data `ShareButton`([Share Api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)) or `PaymentRequest`([PaymentRequest Api](https://developer.mozilla.org/en-US/docs/Web/API/PaymentRequest)) to the user interface (without causing errors). In the form, when clicked, it creates a form submit event (`onSubmit`)
* `BackgroundVideo` - element for displaying background video
* **Form elements**
    * `Form` - an element for creating a form
    * `Toggle` - switch element, has several styles (views) `radio`, `checkbox` and `toggle`. The default is `toggle`. Can accept custom styles (views)
    * `TextField` - element for entering text
    * `SectionForm` - element for grouping form elements
    * `FileField` - element for requesting files or images
    * `DatePicker` - an element for getting the date and time (in development)

> Descendants can be `undefined`, which means that an element is possible at the given location, but it doesn't exist at the moment.

> Event handlers are updated with each redraw (so as not to lose the context)

```Typescript
VStack(
	this.toggle == true
		? text('toggle')
		: undefined
)
```

You can add a destructuring array to the descendants of an element, this creates a dynamic list of elements. Not recommended, since this approach of rendering lists does not take data into account. Use the `ForEach` element if possible.

```Typescript
VStack(
	...this.list.map(item => Texts(item.toString()))

	ForEach(this.list)(item => Texts(item.toString()))
)
```

**In development:** Plans to add svg-based drawing elements. Also in the initial stage of development are gestures (`gesture`)

## Animation

An animation is performed when an element is created or deleted. By default, all elements have a standard animation, but a developer can change the default animation:

```Typescript
const createAnimation = UIAnimation(400)
	.translateYEffect(Units.absolute, -100, 0)
	.opacityEffect(0, 1);
const destroyAnimation = UIAnimation(400)
	.translateYEffect(Units.absolute, 0, -100)
	.opacityEffect(1, 0);


Texts('animations')
	.animationCreate(createAnimation)
	.animationDestroy(destroyAnimation)
```

Most modifiers have the ability to smoothly transition between states. Elements have transitions disabled by default, to enable them use the `.transition` modifier

```Typescript
text('transitions')
	.transition(600, TimingFunction.easeInOut)
	.color(toggle == true ? DefaultColor.red : DefaultColor.green)
```

To animate complex changes to the arrangement of elements or the addition of new ones, use `withAnimation`.

```Typescript
const animation = UIAnimation(400);

withAnimation(animation);
```

## State

The `@State` decorator on the `View` is used to track changes to application data, applied to both regular properties and `Observed` objects.

```Typescript
class StateView extends View {

	@State protected toggle = false

	...
}
```

`Observed` objects keep track of property changes. If they are nested in each other, they report changes in a chain (from the deepest to the top). Changes in the objects to be observed occur immediately. Multiple changes in objects for observation are not grouped. Handlers are called after each change. `Symbol` properties are ignored

For each object to be monitored, two types of events can be subscribed:

* `handler` events are triggered by changes in the current object, the type of event (deletion, change or addition) and the name of the property being changed will be indicated. Subscribe `.addHandler`, unsubscribe `.removeHandler`
* `beacon` events are triggered by changes in the object itself and in nested observables, the events do not indicate where and what exactly has changed. Subscribe `.addBeacon`, unsubscribe `.removeBeacon`

> Be careful with event handlers as they can cause infinitely looping changes

There are several types of objects to observe, they are in the `Observed` namespace and are inherited from the `ObserverInterface` interface:

* `Binding` - an object for binding simple values ​​(strings, numbers, boolean values)
* `LightObserver` - constructor for creating monitored objects
* `Maps` - tracked `Map` object
* `Objects` - tracked object
* `Arrays` - tracked array

**In development (may change in the future):** To persist data for a longer period, use `CoreData` (which is the `Observed` observable). It uses `UI2.AsyncDB` (an asynchronous implementation of [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)) to store data. Each time the page is loaded, the `.init` method is executed, which performs asynchronous actions to get and save data. The `.init` method is passed a `Promise` which can return data from `AsyncDB` if any. On every change, the data is stored in `AsyncDB` and all changes are synchronized between tabs

```Typescript
class CoreDataTest extends CoreData {
	protected async init(data: Promise<CoreData | undefined>): Promise<void> {
		...
	}

	constructor() {
		super('id')
		...
	}
}
```

## Navigation (experimental)

The library uses visual hierarchical navigation. All navigation is carried out through the `NavigationLink` elements, the `View` (constructor function) and, if necessary, arguments are passed to this element. The URL path is divided into segments:

```
/(segment 1)/(segment 2)/.../(segment n)
```

Each `View` is a separate segment. Segments have different behavior:

* `part` - adds a segment to the end of the URL
* `generic` is the same as `part`, but can also contain an identifier. If there is an identifier, it looks like `/(segment name)~(segment id)`
* `root` - with this type of segment, the entire URL is reduced to the form `/(segment 1)`

In order to bind a `View` to a segment, it is necessary to describe a manifest consisting of `ManifestItem`.

```Typescript
App.useManifest(
	new ManifestItem(URLSegment.root, '', HomePageView),
	new ManifestItem(URLSegment.root, 'root', RootView),
	new ManifestItem(URLSegment.generic, 'generic', GenericView),
	new ManifestItem(URLSegment.part, 'part', PartView),
)
```

> Start page `/` is specified via `URLSegment.root` and `''`

To optimize the size of the application, you can dynamically load the `View`. To do this, in `ManifestItem` you need to pass a function that returns `Promise` with `View`. The download happens on demand and is downloaded only once. To link to the loaded `View` use `LinkPathClass` (or `ManifestItem`)

```Typescript
new ManifestItem(URLSegment.root, '', async () => import('./HomePageView.ts').HomePageView);

const HomePageView = new LinkPathClass('', async () => import('./HomePageView.ts').HomePageView)
```

### SEO

For each page (`View`) you can set a meta-description for search engines. The description must be in a class that must inherit from `MetaDescriptionInterface`. To make the class visible to the application, you need to use the `@MetaDescription.addMetaDescription` decorator and set the comparison function.

```Typescript
@MetaDescription.addMetaDescription(url => url == '/')
class homePageSeo extends MetaDescriptionInterface {
	public lang: string = 'en'
	public title: string = 'home page'
	public keywords: string | string[] = ['']
	public description: string = ''
	public JsonLD:string | object | object[] = ''
	public pageIcon: { mimeType: ImageMimeType; size?: string; src: string } = { mimeType: ImageMimeType.svg, src: LogoURL }
	public themeColor?: Color
}
```

### Application Layers

To facilitate the creation of pop-up windows (and not only), the application is divided into several independent layers. Navigation via `NavigationLink` elements works on each layer, but there are differences:

* `app` is the main application layer. URL changes when navigating
* `popover` helper layer, always above the `app` layer, most commonly used for popovers, sidebars and more. When navigating, the URL does not change:

```Typescript
Button()()
	.popoverOnClick(PopoverView, dismiss => [dismiss])
```

---

When finding translation errors, create **Pull requests**

---

## **Documentation under development**