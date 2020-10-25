import { placeholderPlugin, findPlaceholder } from './plugins/placeholder'
import schema from './schema'

const UPLOAD_PRESET = 'r52wr7ds'

export const fillCommand = (obj1, obj2) => {
  const merged = {}
  for (const key in obj1) {
    merged[key] = {
      ...obj1[key],
      command: obj2[key].command
    }
  }
  return merged
}

export const uploadFile = (view, file) => {
  var url = 'https://api.cloudinary.com/v1_1/pvaklb/upload'
  var xhr = new window.XMLHttpRequest()
  var fd = new window.FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Reset the upload progress bar
  // document.getElementById('progress').style.width = 0

  // Update progress (can be used to show progress indicator)
  /*
    xhr.upload.addEventListener('progress', function (e) {
      var progress = Math.round((e.loaded * 100.0) / e.total)
      document.getElementById('progress').style.width = progress + '%'
      console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`)
    }) */

  xhr.onreadystatechange = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // File uploaded successfully
        var response = JSON.parse(xhr.responseText)
        var url = response.secure_url
        console.log('upload done', url)

        // var img = new Image() // HTML5 Constructor
        // img.src = tokens.join('/')
        // img.alt = response.public_id
        // document.getElementById('gallery').appendChild(img)
        const pos = findPlaceholder(view.state, id)
        // If the content around the placeholder has been deleted, drop
        // the image
        if (pos == null) return
        // Otherwise, insert it at the placeholder's position, and remove
        // the placeholder
        view.dispatch(
          view.state.tr
            .replaceWith(pos, pos, schema.nodes.image.create({ src: url }))
            .setMeta(placeholderPlugin, { remove: { id } })
        )
      } else {
        // On failure, just clean up the placeholder
        view.dispatch(tr.setMeta(placeholderPlugin, { remove: { id } }))
      }
    }
  }

  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('tags', 'browser_upload') // Optional - add tag for image admin in Cloudinary
  fd.append('file', file)
  xhr.send(fd)
  view.focus()

  const id = {}

  // Replace the selection with a placeholder
  const tr = view.state.tr
  if (!tr.selection.empty) tr.deleteSelection()
  tr.setMeta(placeholderPlugin, { add: { id, pos: tr.selection.from } })
  view.dispatch(tr)
}
