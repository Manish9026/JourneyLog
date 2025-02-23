import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        startTo: {
            type: Date
        },
        startFrom: {
            type: Date
        },
        amount: {

            type: {
                travelAmount: Number,
                payAmount: Number,
                prevRemainingAmount: Number,
                NewRemainingAmount: Number,

            }
        },
        company: {
            type: {
                cmpId: String,
                cmpName: String,
            }
        }
    }, {
    timestamps: true
}
);

export const paymentModel = mongoose.model("payment", paymentSchema);