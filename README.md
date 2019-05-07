# slate-paged

A _buggy_ attempt at paginating the fantastic [Slate editor](https://github.com/ianstormtaylor/slate).

## History
slate-paged was created due to a lack of actual paginated JavaScript WYSIWYG editors. This project doesn't work well, but it's a start. I was going to use this to make an online script editor like WriterDuet, but did not have enough time.

## Warning:
(see _Issues_ below for a TL;DR)

Originally, this project was intended to be a npm module and be used as a plugin
for slate. As it turns out, paginating a WYSIWYG editor is pretty difficult. I also have not had a lot of time to work on it, so think of this project as more
of a "proof-of-concept" than anything else (do **not** use this for anything production related). 

The code is not great and has a lot of flaws (considering I am new to Slate and React in general). Any help or PRs would be greatly appreciated!

**The main reason** as to why I have gotten stuck on this project is due to performance issues with more than  ~10 pages (ballooning up to 80MB of RAM, which is obviously not acceptable.) Many performance improvements were suggested on the official _slack_ paging channel for Slate, including using `react-virtualized` or similar. However, this complicates things a bit.

The `slate-paged` module currently just lives inside the `src` folder mixed with the demo app, and does not contain files to publish to npm.

## Issues
* More than ~10 pages causes high memory consumption and lag.
* Sometimes, overflow is not triggered properly and page content overflows between pages.
* Backspacing, or moving content "backwards", does not work and deletes headers or footers (see below).
* Footer is offset.
* Schema has been disabled. This used to enforce the layout (i.e. backspacing in content would make sure not to delete the header), but this caused a myriad of other issues.
* No splitting of blocks on page overflow. Instead, the entire last block is moved to the new page.
* No tests.

Fixing these (major) issues would provide us with a pretty barebones but working, paginated editor. 

## How to use
Clone this repo and run `npm install` to install dependencies. Then, run `npm start` to open the sample application. You should be able to type away in the browser! (Good luck, you will need it.)

## How does it work
slate-paged uses one SlateJS editor. Pages are components inside the document, so the layout from slate-paged has to be used. A header and footer is a node, and so is the content. 

The content component is core: It detects overflows and sends a message to the editor to move the most recent block to the next page (including the cursor), or inserts a new page if necessary. It's probably a good idea to take a look at the source code.

## How to use
Since this is not a proper npm module yet, copy over the slate-paged folder into your
slate project and use the following code:

```js
...
import SlatePaged from './slate-paged'
import defaultPageLayout from './slate-paged/default-page-layout'
...

state = {
        value: Value.fromJSON({
            document: {
                nodes: [
                    // Create one initial page. This *has* to be done!
                    Block.create(defaultPageLayout)
                ],
            },
        }),
    }


plugins = [
    SlatePaged()
]

renderNode = (props, editor, next) => {
        const {attributes, children, node} = props

        switch (node.type) {
            case 'paragraph':
                return <p {...attributes}>{children}</p>
            default:
                return next()
        }
    }

render() {
        return <Editor
            value={this.state.value}
            onChange={this.onChange}
            renderNode={this.renderNode}
            plugins={this.plugins}
        />
    }

```

## Options
It is possible to (somewhat) customize the paginated editor without having to modify the original code.

| Option           | Description                                                                                                   | Default                                                          | Status  |   |
|------------------|---------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|---------|---|
| pageLayout       | The Slate array describing the layout of a newly inserted page.                                               | See `default-page-layout.json`                                   | Working |   |
| unit             | The units for changing the dimensions and margins of the page.                                                | `in` (inches)                                                    | Working |   |
| dimensions       | The size of an entire page, including content, footer, header, etc... (in unit described above).              | `{width: '8.5', height: '11'}` (U.S. Letter)                     | Buggy   |   |
| contentMargin    | The margins for the `content` node (i.e. the prominent content of the page) from the page it is contained in. | `{ top: '1', right: '1', bottom: '1', left: '1' }` (U.S. Letter) | Buggy   |   |
| pageClassName    | Class name for page. See `page.css`                                                                           | `page`                                                           | Working |   |
| contentClassName | Class name for content. See `page.css`                                                                        | `content`                                                        | Working |   |
| headerClassName  | Class name for header. See `page.css`                                                                         | `header`                                                         | Working |   |
| footerClassName  | Class name for footer. See `page.css`                                                                         | `footer`                                                         | Working |   |

## Contributing
I need a lot of help to get this to a working state, thus any contribution and constructive critism is very welcome. 

**Feel free to open a PR or create an issue.** I cannot promise I will fix it, but I will definitely answer you and try my best to address it.