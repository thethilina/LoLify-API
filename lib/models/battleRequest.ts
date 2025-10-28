import { Schema, model, models } from "mongoose";

const battleRequestSchema = new Schema(
  {
    user_id_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user_id_to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },

  },
  {
    timestamps: true,
  }
);

const BattleRequest =
  models.BattleRequest || model("BattleRequest", battleRequestSchema);

export default BattleRequest;
