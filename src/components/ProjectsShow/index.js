import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectsShow extends Component {
  state = {
    projectsList: [],
    category: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  onRetry = () => {
    this.getProjects()
  }

  onProject = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()

      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-section">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list">
        {projectsList.map(eachItem => (
          <ProjectItem details={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="header-section">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="bottom-section">
          <select onChange={this.onProject} className="options">
            {categoriesList.map(eachItem => (
              <option
                className="option-item"
                key={eachItem.id}
                value={eachItem.id}
              >
                {eachItem.displayText}
              </option>
            ))}
          </select>
          <div>{this.renderAll()}</div>
        </div>
      </div>
    )
  }
}

export default ProjectsShow
