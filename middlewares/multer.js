import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb("", './public/temp/SupportingEvidence')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb("", file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ storage: storage }).single("file");