// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgreess: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemDetailsObject: {},
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getSimilarDetails = item => ({
    id: item.id,
    imageUrl: item.image_url,
    title: item.title,
    style: item.style,
    price: item.price,
    description: item.description,
    brand: item.brand,
    totalReviews: item.total_reviews,
    rating: item.rating,
    availability: item.availability,
  })

  getItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgreess})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        style: data.style,
        description: data.description,
        price: data.price,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(each =>
          this.getSimilarDetails(each),
        ),
      }

      this.setState({
        itemDetailsObject: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1 className="error-heading">Product Not Found</h1>
      <button type="button" className="continue-button">
        Continue Shopping
      </button>
    </div>
  )

  renderInProgressView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onDecrementCount = () =>
    this.setState(prevState => ({
      count: prevState.count - 1,
    }))

  onIncrementCount = () =>
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))

  renderSuccessView = () => {
    const {itemDetailsObject, count} = this.state

    const {
      imageUrl,
      title,

      availability,
      brand,
      description,
      price,
      rating,
      totalReviews,
      similarProducts,
    } = itemDetailsObject
    console.log(similarProducts)

    const value = Math.floor(rating)

    return (
      <div className="item-container">
        <div className="product-container">
          <img className="product-image" src={imageUrl} alt="product" />
          <div className="content-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="reviews-container">
              <div className="rating-container">
                {value}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              Available: <span className="text">{availability}</span>
            </p>
            <p className="brand">
              Brand: <span className="text">{brand}</span>
            </p>
            <hr className="line" />

            <div className="count-container">
              <button
                type="button"
                className="minus"
                onClick={this.onDecrementCount}
              >
                -
              </button>
              {count}
              <button
                type="button"
                className="plus"
                onClick={this.onIncrementCount}
              >
                +
              </button>
            </div>
            <button className="add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1 className="head">Similar Products</h1>
          <ul>
            {
              similarProducts.map(eachOne => (
                <SimilarProductItem productDetails={eachOne} key={eachOne.id} />
              ))
            }
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="product-item-container">
        <Header />
        {this.renderSuccessView()}
      </div>
    )
  }
}

export default ProductItemDetails
