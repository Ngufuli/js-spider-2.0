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

function spiderLinks(currentUrl, body, nesting, cb){
    if(nesting === 0){
        return ProcessingInstruction.nextTick(cb);
    }

    const links = getPageLinks(currentUrl, body)
    if(links.length === 0){
        return ProcessingInstruction.nextTick(cb);
    }

    function iterate(index){
        if(index === links.length){
            return cb()
        }

        spider(links[index], nesting - 1, function(err){
            if(err){
                return cb(err);
            }
            iterate(index + 1)
        })
    }
    eterate(0);
}