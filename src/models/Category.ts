import mongoose, { Document } from 'mongoose'
export type CategoryDocument = Document & {
	name: string,
	title: string,
	slug: string
  }

  const categorySchema= new mongoose.Schema({ 
	name: {
		type: String,
		index: true,
	  },
	  title: {
		type: String,
		index: true,
	  },
	  slug: {
		type: String,
		index: true,
	  }
})

categorySchema.virtual('products', {
	ref: 'products', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'category', // is equal to foreignField
 })
 
 // Set Object and Json property to true. Default is set to false
 categorySchema.set('toObject', { virtuals: true })
 categorySchema.set('toJSON', { virtuals: true })


 export default mongoose.model<CategoryDocument>('category', categorySchema)
