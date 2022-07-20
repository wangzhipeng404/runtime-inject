
const getPolicyBase64 = function (policyText) {
  return Base64.encode(JSON.stringify(policyText))
}

const getSignature = function (accesskeysecret, policyBase64) {
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskeysecret, {
    asBytes: true
  })
  return Crypto.util.bytesToBase64(bytes)
}

function OSSCreater (context, config ) {
  const { cloudserv, tenantcode, isPrivate, isProd, responseGetter } = config
  return new Promise((resovle, reject) => {
    context.$require([
      '../OSS/Base64.js',
      '../OSS/hmac.js',
      '../OSS/sha1.js',
      '../OSS/crypto.js',
      '../OSS/ali.sdk.min.js',
      '../OSS/esdk-obs-browserjs-without-polyfill.3.22.3.min.js'
    ]).then(() => {
      let isRequesting = false
      const oss = {
        getToken () {
          console.log('getToken')
          let servtoken = localStorage.getItem('servtoken')
          let last
          if (servtoken) {
            servtoken = JSON.parse(servtoken)
            last = new Date(servtoken.expiration).getTime()
          }
          const now = Date.now()
          if (!servtoken || (last - now < (1000 * 60 * 5))) {
            localStorage.removeItem('servtoken')
            if (!isRequesting) {
              isRequesting = true
              return context.axios({
                url: `${window.__baseUrl}/api/teapi/auth/servtoken`,
                method: 'get',
              }).then((res) => {
                if (responseGetter) {
                  res = responseGetter(res)
                }
                localStorage.setItem('servtoken', JSON.stringify(res))
                isRequesting = false
                return res
              })
            } else {
              return new Promise((resolve, reject) => {
                const fn = setInterval(() => {
                  let servtoken = localStorage.getItem('servtoken')
                  if (servtoken) {
                    resolve(JSON.parse(servtoken))
                    clearInterval(fn)
                  }
                }, 200)
              })
            }
          } else {
            return Promise.resolve(servtoken)
          }
        },
        getCloudConfig: (bucket) => {
          console.log('getCloudConfig')
          return oss.getToken().then((cloud) => {
            console.log(cloud)
            if (bucket.provider === 'aliyun') {
              return new OSS({
                endpoint: bucket.storageendpoint,
                accessKeyId: cloud.accesskeyid,
                accessKeySecret: cloud.accesskeysecret,
                stsToken: cloud.securitytoken,
                bucket: bucket.storagebucket
              })
            }
            if (bucket.provider === 'huawei') {
              return new ObsClient({
                access_key_id: cloud.accesskeyid,
                secret_access_key: cloud.accesskeysecret,
                server: bucket.storageendpoint,
                security_token: cloud.securitytoken
              })
            }
            throw new Error('暂不支持此存储类型')
          })
        },
        upload (filename, filePath) {
          return getToken().then((cloud) => {
            const bucket = cloudserv
            const timestamp = Date.now()
            const date = context.$dayjs(timestamp).format('YYYYMMDD')
            // 文件名前三位/文件业务类型/年月日/租户code/文件名.扩展名
            const objectkey = `${filename.slice(0, 3)}/img/${date}/${tenantcode}/${filename}`
            let aliyunServerURL
            if (isprod) {
              aliyunServerURL = `${bucket.storageurl}/${bucket.bucket}`
              // aliyunServerURL = `${bucket.storageurl}`
            } else {
              aliyunServerURL = `https://${bucket.storageurl}`
            }

            const forms = new FormData()
            forms.append('file', file.target.files[0])
            if (api.isprod) {
              return context.axios({
                url: `${aliyunServerURL}/${objectkey}`,
                method: 'PUT',
                data: forms,
                headers: {
                  'Content-Type': 'image/jpeg,image/jpg,image/png'
                }
              }).then(res => {
                const url = `${aliyunServerURL}/${objectkey}`
                return {
                  url,
                  source: filename,
                  datetime: timestamp.toString()
                }
              })
            } else {
              let uploadConfig = {
                url: aliyunServerURL,
              }
              if (bucket.provider === 'aliyun') {
                const policyText = {
                  'expiration': '2050-01-01T12:00:00.000Z',
                  'conditions': [
                    ['content-length-range', 0, 10 * 1024 * 1024] // 设置上传文件的大小限制,1048576000=1000mb
                  ]
                }
                const policyBase64 = getPolicyBase64(policyText)
                const signature = getSignature(cloud.accesskeysecret, policyBase64)
                uploadConfig = {
                  ...uploadConfig,
                  headers: {},
                  formData: {
                    'authorization': 'OSS ' + cloud.accesskeyid + ':' + signature,
                    'key': objectkey,
                    'OSSAccessKeyId': cloud.accesskeyid,
                    'policy': policyBase64,
                    'Signature': signature,
                    'success_action_status': '200',
                    'x-oss-security-token': cloud.securitytoken
                  }
                }
              } else if (bucket.provider === 'huawei') {
                const OBSPolicy = {
                  'expiration': '20250-12-31T12:00:00.000Z',
                  'conditions': [
                    { 'bucket': bucket.storagebucket },
                    { 'x-obs-security-token': cloud.securitytoken },
                    { 'success_action_status': '200' },
                    { 'key': objectkey }
                  ]
                }
                console.log('OBSPolicy', OBSPolicy)
                const policyBase64 = getPolicyBase64(OBSPolicy)
                const signature = getSignature(cloud.accesskeysecret, policyBase64)
                uploadConfig = {
                  ...uploadConfig,
                  headers: {
                    'content-type': 'multipart/form-data; boundary=-9431149156168'
                  },
                  formData: {
                    'AccessKeyID': cloud.accesskeyid,
                    'policy': policyBase64,
                    'signature': signature,
                    'key': objectkey,
                    'success_action_status': '200',
                    'x-obs-security-token': cloud.securitytoken
                  }
                }
              } else {
                throw new Error('暂不支持上传至该类型存储')
              }
              console.log(uploadConfig)
              // debugger
              Object.keys(uploadConfig.formData).forEach(k => {
                forms.append(k, uploadConfig.formData[k])
              })
              return context.axios.post(uploadConfig.url, forms, {
                headers: uploadConfig.headers
              })
            }
          })
        },
        getUrl(type, file, size) {
          const dealFile = file
          size = size || {}
          return new Promise((resolve, reject) => {
            console.log(file)
            const date = context.$dayjs(Number(dealFile.datetime)).format('YYYYMMDD')
            let objectkey
            if (type === 'file') {
              objectkey = `${dealFile.source.slice(0, 3)}/att/${date}/${tenantcode}/${dealFile.source}`
            } else if (type === 'rtxe') {
              objectkey = `${dealFile.source.slice(0, 3)}/att/${date}/${tenantcode}/${dealFile.source}`
            } else if (type === 'img') {
              objectkey = `${dealFile.source.slice(0, 3)}/img/${date}/${tenantcode}/${dealFile.source}`
            }
            console.log(objectkey)
            let process = ''
            // process = 'image/resize,m_fixed,h_100'
            if (type === 'img') {
              if (size.width || size.height) {
                process = `image/resize,m_fixed`
                if (size.width) {
                  process += `,w_${size.width}`
                }
                if (size.height) {
                  process += `,h_${size.height}`
                }
              }
            }
            console.log(isPrivate, cloudserv)
            if (!isPrivate) {
              let url
              if (isProd) {
                url = `${cloudserv.storageurl}/${cloudserv.bucket}/${objectkey}?x-oss-process=${encodeURIComponent(process)}`
              } else {
                url = `https://${cloudserv.storageurl}/${objectkey}?x-oss-process=${encodeURIComponent(process)}`
              }
              console.log(url)
              resolve(url)
            } else {
              const bucket = cloudserv
              oss.getCloudConfig(bucket).then((client) => {
                let url = ''
                if (bucket.provider === 'aliyun') {
                  url = client.signatureUrl(objectkey, {
                    process: process
                  })
                } else {
                  const Params = {
                    Bucket: bucket.storagebucket,
                    Key: objectkey
                  }
                  if (type === 'img') {
                    Params.QueryParams = {
                      'x-image-process': process
                    }
                  }
                  url = client.createSignedUrlSync(Params).SignedUrl
                }
                console.log(url)
                url = url.replace('http://', 'https://')
                resolve(url)
              })
            }
          })
        }
      }
      resovle(oss)
    })
  })
}