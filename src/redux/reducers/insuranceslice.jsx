// src/redux/reducers/jobSurveySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/firebaseConfig";

// ─────────────────────────────
// Initial State
// ─────────────────────────────
const initialState = {
  fields: {
    billNo: "",
    carName: "",
    carModel: "",
    customerName: "",
    customerContactNo: "",
    insuranceCompanyName: "",
    vehicleNo: "",
    colour: "",
    lossNo: "",
    nameOfOwner: "",
    surveyorCompanyName: "",
    surveyorName: "",
    surveyorContactNo: "",
    surveyDate: "",
    mileage: "",
    chassisNo: "",
    engineNo: "",
    remarks: "",
    paid: 0,
  },

  items: {
    labour: [],
    parts: [],
    labourTotal: 0,
    partsTotal: 0,
    grandTotal: 0,
    taxPercent: 0,
    deprPercent: 0,
  },

  images: {
    before: [],
    after: [],
    reinspection: [],
  },

  savedJob: null,
  status: "idle",
  error: null,
};

// ─────────────────────────────
// Helper: Update Totals
// ─────────────────────────────
function updateTotals(state) {
  const tax = state.items.taxPercent / 100;
  const depr = state.items.deprPercent / 100;

  state.items.labour = state.items.labour.map(item => ({
    ...item,
    finalPrice: item.price + item.price * tax,
  }));

  state.items.parts = state.items.parts.map(item => ({
    ...item,
    finalPrice: item.price - item.price * depr,
  }));

  state.items.labourTotal = state.items.labour.reduce(
    (sum, item) => sum + (item.finalPrice || 0),
    0
  );

  state.items.partsTotal = state.items.parts.reduce(
    (sum, item) => sum + (item.finalPrice || 0),
    0
  );

  state.items.grandTotal =
    state.items.labourTotal + state.items.partsTotal;
}

// ─────────────────────────────
// Firebase Save Function
// ─────────────────────────────
export const insuranceJobFileSave = async (data) => {
  try {
    const { fields, items, images } = data;

    const uploadedImages = {
      before: [],
      after: [],
      reinspection: [],
    };

    for (const key of ["before", "after", "reinspection"]) {
      for (const file of images[key]) {
        const imgRef = ref(
          storage,
          `jobFiles/${fields.billNo}/${key}/${Date.now()}`
        );

        await uploadString(imgRef, file, "data_url");
        const url = await getDownloadURL(imgRef);

        uploadedImages[key].push(url);
      }
    }

    const docRef = await addDoc(collection(db, "jobSurveys"), {
      ...fields,
      items,
      images: uploadedImages,
      createdAt: new Date().toISOString(),
    });

    return { id: docRef.id };
  } catch (err) {
    throw err;
  }
};

// ─────────────────────────────
// Thunk: Save Job Survey
// ─────────────────────────────
export const saveJobSurvey = createAsyncThunk(
  "jobSurvey/saveJobSurvey",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().jobSurvey;

      const result = await insuranceJobFileSave({
        fields: state.fields,
        items: state.items,
        images: state.images,
      });

      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────
// Slice
// ─────────────────────────────
const jobSurveySlice = createSlice({
  name: "jobSurvey",
  initialState,
  reducers: {
    updateField: (state, action) => {
      state.fields[action.payload.field] = action.payload.value;
    },

    resetForm: () => initialState,

    addItem: (state, action) => {
      state.items[action.payload].push({ name: "", price: 0 });
      updateTotals(state);
    },

    updateItem: (state, action) => {
      const { section, index, key, value } = action.payload;
      if (state.items[section][index]) {
        state.items[section][index][key] =
          key === "price" ? Number(value) : value;
      }
      updateTotals(state);
    },

    removeItem: (state, action) => {
      state.items[action.payload.section].splice(
        action.payload.index,
        1
      );
      updateTotals(state);
    },

    addImage: (state, action) => {
      state.images[action.payload.type].push(action.payload.file);
    },

    removeImage: (state, action) => {
      state.images[action.payload.type].splice(
        action.payload.index,
        1
      );
    },

    updatePercent: (state, action) => {
      if (action.payload.taxPercent !== undefined) {
        state.items.taxPercent = action.payload.taxPercent;
      }
      if (action.payload.deprPercent !== undefined) {
        state.items.deprPercent = action.payload.deprPercent;
      }
      updateTotals(state);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(saveJobSurvey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveJobSurvey.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.savedJob = action.payload;
      })
      .addCase(saveJobSurvey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  updateField,
  resetForm,
  addItem,
  updateItem,
  removeItem,
  addImage,
  removeImage,
  updatePercent,
} = jobSurveySlice.actions;

export default jobSurveySlice.reducer;
