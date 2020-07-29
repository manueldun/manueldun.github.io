
export function getStringFile(path,fileName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path+fileName,true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    })
}
export function getBinaryFile(path,fileName) {
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", path+fileName, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            var arrayBuffer = oReq.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                resolve(oReq.response)
            }
        };
        oReq.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        oReq.send(null);
    });
}