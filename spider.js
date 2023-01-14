export function spider(url, nesting, cb){
    const filename = urlToFilename(url)
    fs.readFile(filename, 'utf8', (err, fileContent) => {
        if(err){
            if(err.code !== 'ENOENT'){
                return cb(err)
            }

            return download(url, filename, (err, requestContent) => {
                if(err){
                    return cb(err)
                }

                spiderLinks(url, requestContent, nesting, cb)
            })
        }
        spiderLinks(url, fileContent, nesting, cb)
    })
}