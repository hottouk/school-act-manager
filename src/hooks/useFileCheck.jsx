const useFileCheck = () => {

  const getExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  const getIsImageCheck = (fileName) => {
    let ext = getExtension(fileName)
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
      case 'jpeg':
        return true;
      default: return false
    }
  }
  return (
    { getIsImageCheck }
  )
}

export default useFileCheck