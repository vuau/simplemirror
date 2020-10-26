import schema from './schema'

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

export const injectFileToView = (view, url) => {
  view.dispatch(
    view.state.tr.replaceWith(
      view.state.tr.selection.from,
      view.state.tr.selection.to,
      schema.nodes.image.create({ src: url })
    )
  )
}

export const loadScript = src => {
  return new Promise(function (resolve, reject) {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`Script load error for ${src}`))
    document.head.append(script)
  })
}

export const showUploadWidget = () =>
  new Promise((resolve, reject) => {
    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'pvaklb',
        uploadPreset: 'cqdpmj8p'
      },
      (error, result) => {
        if (error) {
          throw error
        }
        if (result && result.event === 'success') {
          console.log('Done! Here is the image info: ', result.info)
          resolve(result.info.url)
        }
      }
    )
    uploadWidget.open()
  })
