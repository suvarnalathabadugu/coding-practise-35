import './index.css'

const ProjectItem = props => {
  const {details} = props
  const {imageUrl, name} = details

  return (
    <li className="project">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectItem
