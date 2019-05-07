// Import React!
import React from 'react'
import {Editor} from 'slate-react'
import {Value} from 'slate'
import {Block} from "slate"

import SlatePaged from './slate-paged'
import defaultPageLayout from './slate-paged/default-page-layout'

import './slate-paged/page.css'

class App extends React.Component {
    state = {
        value: Value.fromJSON({
            document: {
                nodes: [
                    // Create one initial page.
                    Block.create(defaultPageLayout)
                ],
            },
        }),
    }

    plugins = [
        SlatePaged({
            'dimensions': {width: '8', height: '12'}
        })
    ]

    onChange = ({value}) => {
        this.setState({value})
    }

    renderNode = (props, editor, next) => {
        const {attributes, children, node} = props

        switch (node.type) {
            case 'paragraph':
                return <div className="paragraph" {...attributes}>{children}</div>
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
}

export default App;
