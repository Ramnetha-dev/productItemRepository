// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props

  const {
    imageUrl,
    title,
    price,

    brand,

    rating,
  } = productDetails

  return (
    <li>
      <img src={imageUrl} alt={`similar product ${title}`} className="image" />
      <p>{title}</p>
      <p>{brand}</p>
      <div>
        <p>Rs {price}/-</p>
        <span>
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </span>
      </div>
    </li>
  )
}

export default SimilarProductItem
