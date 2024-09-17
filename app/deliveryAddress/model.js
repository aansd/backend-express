const {Schema, model, modelNames} = require('mongoose');

const deliveryAddressSchema = Schema({
    nama: {
        type:String,
        required: [true, 'nama alamat harus di isi'],
        maxLength: [255, 'panjang maksimal nama alamat adalah 255 karakter']
    },
    kelurahan: {
        type: String,
        required: [true, 'kelurahan wajib di isi'],
        maxLength: [255, 'panjang maksimal nama kelurahan adalah 255 karakter']
    },
    kecamatan: {
        type: String,
        required: [true, 'kecamatan wajib di isi'],
        maxLength: [255, 'panjang maksimal nama kecamatan adalah 255 karakter']
    },
    kabupaten: {
        type: String,
        required: [true, 'kabupaten/kota wajib di isi'],
        maxLength: [255, 'panjang maksimal nama kabupaten/kota adalah 255 karakter']
    },
    provinsi: {
        type: String,
        required: [true, 'provinsi wajib di isi'],
        maxLength: [255, 'panjang maksimal nama provinsi adalah 255 karakter']
    },
    detail: {
        type: String,
        required: [true, 'Detail wajib di isi'],
        maxLength: [1000, 'panjang maksimal nama detail adalah 1000 karakter']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = model('DeliverAddress', deliveryAddressSchema);