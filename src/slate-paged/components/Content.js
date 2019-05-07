import React from "react"

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.margin = this.props.margin;
        this.unit = this.props.unit;
        this.dimensions = this.props.dimensions;
        this.isOverflowed = false;
        this.domElement = null;
        this.checkOverflow = this.checkOverflow.bind(this);
    }

    componentDidUpdate() {
        this.checkOverflow();
    }

    /// this has most likely a pretty big performance impact
    checkOverflow() {
        const isOverflowed =
            this.domElement.scrollHeight > this.domElement.clientHeight;

        if (isOverflowed !== this.isOverflowed) {
            this.isOverflowed = isOverflowed;

            if (this.props.onOverflow && this.isOverflowed) {
                this.props.onOverflow();
            }
        }
    }

    render() {
        const {attributes, children} = this.props;
        return <div ref={elem => this.domElement = elem}
                    style={{
                        marginTop: 0,
                        marginRight: this.margin.right + this.unit,
                        marginBottom: this.margin.bottom + this.unit,
                        marginLeft: this.margin.left + this.unit,
                        height: (this.dimensions.height - this.margin.bottom*2) + this.unit
                    }}
                    className={this.props.className} {...attributes}>{children}</div>
    }
}

export default Content
