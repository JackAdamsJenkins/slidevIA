import PropTypes from 'prop-types'
import '../App.css'

// Fonction de rendu markdown harmonisée
function renderMarkdown(content = '') {
  let cleanContent = content.trim()
  cleanContent = cleanContent
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold text-blue-300 mb-4 mt-6">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold text-purple-300 mb-6 mt-8">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-white mb-8 mt-10">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-purple-300">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-green-300 font-mono text-sm">$1</code>')
    .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-2 flex items-start"><span class="text-blue-400 mr-2">•</span><span>$1</span></li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-2 flex items-start"><span class="text-purple-400 mr-2 font-semibold">•</span><span>$1</span></li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br>')
    .replace(/(<li.*<\/li>)/s, '<ul class="space-y-2 mb-6">$1</ul>')
    .replace(/^(.*)$/, '<p class="mb-4 leading-relaxed">$1</p>')
  return cleanContent
}

const SlideDisplay = ({ title, content, className = '' }) => (
  <div className={`slide-container ${className}`}>
    <h1 className="slide-title">{title}</h1>
    <div
      className="slide-content prose prose-lg prose-invert max-w-none text-gray-100 leading-relaxed text-center"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  </div>
)

SlideDisplay.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string
}

export default SlideDisplay
