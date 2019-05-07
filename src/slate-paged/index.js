import React from "react"
import Content from "./components/Content"
import {Block} from "slate"

import defaultPageLayout from './default-page-layout'

function SlatePaged(options = {}) {
    const {
        pageLayout = defaultPageLayout,
        unit = 'in',
        dimensions = {width: '8.5', height: '11'},
        contentMargin = { top: '1', right: '1', bottom: '1', left: '1' },
        pageClassName = 'page',
        contentClassName = 'content',
        headerClassName = 'header',
        footerClassName = 'footer',
    } = options

    function pageOverflowed(editor) {
        // On an overflow, insert a new page and move content down.
        insertPageBelowCurrent(editor)
    }

    function insertPageBelowCurrent(editor) {
        const {value} = editor
        const {document, selection} = value
        const {start} = selection

        const page = document.getFurthestBlock(start.key)

        // Make sure it's an actual page node.
        if (page.type === 'page') {
            const content = page.getChild([1])
            const lastBlock = content.getBlocks().last()

            var nextPage = document.getNextSibling(page.key)

            // good way to do this?
            if (nextPage === undefined) {
                nextPage = Block.create(pageLayout)

                editor.insertNodeByKey(document.key, document.nodes.size, nextPage)
            }

            const nextContent = nextPage.getChild([1])
            editor.moveNodeByKey(lastBlock.key, nextContent.key)
        }
    }

    function renderNode(props, editor, next) {
        const {attributes, children, node} = props

        switch (node.type) {
            case 'page':
                return <div className={pageClassName} style={{
                    width: dimensions.width + unit, // concat with unit is ugly and bad, figure out something better
                    height: dimensions.height + unit,
                    maxHeight: dimensions.height + unit
                }} {...attributes}>{children}</div>
            case 'content':
                return <Content className={contentClassName}
                                margin={contentMargin}
                                unit={unit}
                                dimensions={dimensions}
                                onOverflow={pageOverflowed.bind(this, editor)} {...props} />
            case 'header':
                return <div className={headerClassName} {...attributes}>{children}</div>
            case 'footer':
                return <div className={footerClassName} {...attributes}>{children}</div>
            default:
                return next()
        }
    }

    function getPageCount(editor) {
        // TODO: return page count. 
    }

    return {
        renderNode: renderNode,
        commands: {
            insertPageBelowCurrent
        },
        queries: {
            getPageCount
        }
    }
}

export default SlatePaged
