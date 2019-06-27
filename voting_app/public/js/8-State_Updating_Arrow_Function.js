class ProductList extends React.Component {

    //With property initializers, we no longer need to use constructor. Instead, we can define the initial
    //state like this
    state = {
        products: [],
    };

    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         products: [],
    //     };
    //
    //     this.handleProductUpVote = this.handleProductUpVote.bind(this)
    //
    // }

    componentDidMount() {
        this.setState({products: Seed.products});
    }

    //1. We can use arrow functions for custom component methods (and avoid having to bind this)
    //2. We can define the initial state outside of constructor()
    handleProductUpVote = (productId) => {
        console.log(productId + 'was upvoted.');
        const products = this.state.products
        const productsCopy = this.state.products.map(
            (product) => {
                if (product.id == productId) {
                    return Object.assign({},product, {
                        votes : product.votes + 1 ,
                    });
                } else {
                    return product
                }
            }
        );
        this.setState({
            products: productsCopy,
        });
    }

    render() {

        const products = this.state.products.sort((a, b) => (
                a.votes - b.votes
            )
        );

        const productComponents = products.map((product) => (
            <Product
                key={'product-' + product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                url={product.url}
                votes={product.votes}
                submitterAvatarUrl={product.submitterAvatarUrl}
                productImageUrl={product.productImageUrl}
                onVote={this.handleProductUpVote}
            />
        ));
        return (
            <div className='ui unstackable items'>
                {productComponents}
            </div>
        )
    }
}


class Product extends React.Component {
    //With the transform-class-properties plugin, we can write handleUpVote as an arrow function.
    //This will ensure this inside the function is bound to the component, as expected.
    //Using this feature, we can drop constructor(). There is no need for the manual binding call.
    handleUpVote = () => (
        this.props.onVote(this.props.id)
    );

    render() {
        return (
            <div className='item'>
                <div className='image'>
                    <img src={this.props.productImageUrl}/>
                </div>


                <div className='middle aligned content'>

                    <div className='middle aligned content'>
                        <div className='header'>
                            <a onClick={this.handleUpVote}>
                                <i className='large caret up icon'/>
                            </a>
                            {this.props.votes}
                        </div>
                        <div className='description'>
                            <a href={this.props.url}>
                                {this.props.title}
                            </a>
                            <p>
                                {this.props.description}
                            </p>
                        </div>
                        <div className='extra'>
                            <span>Submitted by:</span>
                            <img className='ui avatar image' src={this.props.submitterAvatarUrl}/>
                        </div>
                    </div>

                </div>


            </div>
        );
    }
}

ReactDOM.render(
    <ProductList/>,
    document.getElementById('content_app1')
);