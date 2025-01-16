import multer from 'multer';
import path from 'path';
import axios from 'axios';
import Seat from '../models/seat.js';


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads');  // Dosyanın kaydedileceği klasör
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));  // Dosya ismini zaman damgası ile oluştur
//     }
// });
/////////////////////////////////////////////////////////////////////////////////
// const storage = multer.memoryStorage();

// export const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 50 * 1024 * 1024  // Maksimum dosya boyutu 10MB
//     },
//     fileFilter: (req, file, cb) => {
//         const allowedFileTypes = ['jpeg', 'jpg', 'png'];
//         const extname = allowedFileTypes.includes(path.extname(file.originalname).toLowerCase().slice(1));
//         const mimeType = allowedFileTypes.some(type => file.mimetype.includes(type));
//         if (extname && mimeType) {
//             return cb(null, true); 
//         } else {
//             cb(new Error("Only jpg, jpeg, and png files are allowed."));
//         }
//     }
// });

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const sendImageToPython = async (lastSaloon,block,res) => {
    try {

        // Block'u veritabanından bul
        const saloon = lastSaloon
        if (!saloon) {
            return { success: false, message: "Saloon not found" };
        }
        console.log("Saloon:",saloon.image.url);
        // Saloon array'inden bir image path'i al (örneğin ilk saloon'dan)
        const imagePath = saloon.image.url;
        if (!imagePath) {
            return { success: false, message: "No image found in this saloon" };
        }

        // Python API'ye resim yolunu gönder
        const pythonResponse = await axios.post('http://localhost:5001/process-image', {
            imagePath: imagePath, // Python API'ye gönderilen resim yolu
        });
        
        console.log(pythonResponse.data);

        // Python'dan dönen koordinatları al
        const circles = pythonResponse.data.circles; // Python'dan dönen (x, y, r) koordinatları

        // Dönen veriyi backend'teki Seat modeline kaydet
        const seatData = circles.map((circle, index) => {
            return {
                seatNumber: index + 1, // Her bir koltuğa benzersiz bir sıra numarası
                saloonName: lastSaloon.saloonName, // Saloon adı
                block: block._id, // Block ID'si
                isBooked: false, // Varsayılan olarak boş
                position: {
                    x: circle.x, // x koordinatı
                    y: circle.y, // y koordinatı
                    r: circle.r // r (yarıçap) değeri
                }
            };
        });

        // Seat modeline kaydet
        await Seat.insertMany(seatData);

        return { success: true, data: seatData };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error processing image" };
    }
};

// export const upload_file = async (file, folder) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.v2.uploader.upload(file, { folder: folder }, (err, result) => {
//             if (err) return reject(err);
//             resolve({
//                 public_id: result.public_id,
//                 url: result.secure_url
//             })
//         })
//     })
// }