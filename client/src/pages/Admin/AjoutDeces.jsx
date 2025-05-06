import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import axoisInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import CheckboxGroup from "../../components/Inputs/CheckboxGroub";
import CheckboxGroupNoOther from "../../components/Inputs/CheckboxGroubNoOther";

const categoryOptions = [
  { id: "domicile", label: "Domicile" },
  { id: "publique", label: "Voie publique" },
  { id: "santé", label: "Structure de santé publique" },
  { id: "santePrivee", label: "Structure de santé privée" },
];
const categoryOptionsCause = [
  { id: "naturelle", label: "Cause naturelle" },
  { id: "violente", label: "Cause violente" },
  { id: "indeterminee", label: "Cause indéterminée" },
];

function AjoutDeces() {
  const location = useLocation();
  const { recordId } = location.state || {};
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [recordData, setRecordData] = useState({
    ArabicFullName: "",
    LatinFullName: "",
    BirthDate: null,
    City: "",
    Wilaya: "",
    Gender: "",
    parents: {
      fatherName: "",
      motherName: "",
    },
    SignedBy: "",
    DateOfDeath: null,
    PlaceOfDeath: "",
    CauseOfDeath: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    categories: [],
    otherCategory: "",
    causeDirecte: "",
    evenementsMorbides: {
      b: "",
      c: "",
      d: "",
    },
    autresEtats: "",
    mortViolente: "",
    natureMort: {
      type: "naturelle",
    },
    mortalite: {
      grossesseMultiple: false,
      mortNe: false,
      ageGestationnel: 0,
      poidsNaissance: 0,
      ageMere: 0,
      etatMorbideMere: "",
    },
    decesMaternel: {
      estDecesMaternel: false,
      moment: null,
    },
    interventionChirurgicale: false,
    signalementMedicoLegal: {
      obstacleInhumation: false,
      cercueilHermetique: false,
      autopsie: false,
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setRecordData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // reset form
    setRecordData({
      ArabicFullName: "",
      LatinFullName: "",
      BirthDate: null,
      City: "",
      Wilaya: "",
      Gender: "",
      parents: {
        fatherName: "",
        motherName: "",
      },
      SignedBy: "",
      DateOfDeath: null,
      PlaceOfDeath: "",
      CauseOfDeath: "",
    });
  };

  const handleCategoriesChange = (selected, otherValue) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   categories: selected,
    //   otherCategory: otherValue,
    // }));
  };

  // Create record
  const createRecord = async () => {
    setLoading(true);

    try {
      await axoisInstance.post(API_PATHS.RECORD.CREATE_RECORD, {
        ...recordData,
        BirthDate: new Date(recordData.BirthDate).toISOString(),
        DateOfDeath: recordData.DateOfDeath
          ? new Date(recordData?.DateOfDeath)?.toISOString()
          : null,
        PlaceOfDeath: recordData.PlaceOfDeath ? recordData.PlaceOfDeath : null,
        CauseOfDeath: recordData.CauseOfDeath ? recordData.CauseOfDeath : null,
      });

      toast.success("Record Added Successfully");

      clearData();
    } catch (error) {
      console.error("Error creating record: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Update Record
  const updateRecord = async () => {
    setLoading(false);

    try {
      await axoisInstance.put(API_PATHS.TASKS.UPDATE_TASK(recordId), {
        ...recordData,
        BirthDate: new Date(recordData.BirthDate).toISOString(),
        DateOfDeath: recordData.DateOfDeath
          ? new Date(recordData?.DateOfDeath)?.toISOString()
          : null,
        PlaceOfDeath: recordData.PlaceOfDeath ? recordData.PlaceOfDeath : null,
        CauseOfDeath: recordData.CauseOfDeath ? recordData.CauseOfDeath : null,
      });

      toast.success("Record Updated Seccessfully");
    } catch (error) {
      console.error("Error update record :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Get record info by ID
  const getRecordDetailsByID = async () => {
    try {
      const response = await axoisInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(recordId)
      );

      if (response.data) {
        const recordInfo = response.data;

        setRecordData(() => ({
          ArabicFullName: recordInfo.ArabicFullName,
          LatinFullName: recordInfo.LatinFullName,
          BirthDate: recordInfo.BirthDate
            ? moment(recordInfo.BirthDate).format("YYY-MM-DD")
            : null,
          City: recordInfo.City,
          Wilaya: recordInfo.Wilaya,
          Gender: recordInfo.Gender,
          parents: {},
          SignedBy: recordInfo.SignedBy,
          DateOfDeath: recordInfo.DateOfDeath
            ? moment(recordInfo.DateOfDeath).format("YYY-MM-DD")
            : null,
          PlaceOfDeath: recordInfo.PlaceOfDeath,
          CauseOfDeath: recordInfo.CauseOfDeath,
        }));
      }
    } catch (error) {
      console.error("Error fetching record data : ", error);
    }
  };

  // Delete Record
  const deleteUser = async () => {
    try {
      await axoisInstance.delete(API_PATHS.TASKS.DELETE_TASK(recordId));

      setOpenDeleteAlert(false);
      toast.success("Record deleted successfully");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        "Error Deleting Record : ",
        error.response?.data?.message || error.message
      );
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // // Input validation
    if (!recordData.ArabicFullName.trim()) {
      setError("Arabic Full Name is required.");
      return;
    }
    if (!recordData.LatinFullName.trim()) {
      setError("Latin Full Name is required.");
      return;
    }
    if (!recordData.BirthDate) {
      setError("Birth Date is required.");
      return;
    }
    if (!recordData.Gender) {
      setError("Gender is required.");
      return;
    }

    if (!recordData.City) {
      setError("Gender is required.");
      return;
    }

    if (!recordData.Wilaya) {
      setError("Gender is required.");
      return;
    }

    if (!recordData.parents.fatherName) {
      setError("father name is required.");
      return;
    }

    if (!recordData.parents.motherName) {
      setError("mother name is required.");
      return;
    }

    if (!recordData.SignedBy) {
      setError("Signed By is required.");
      return;
    }

    if (recordId) {
      updateRecord();
      return;
    }

    createRecord();
  };

  useEffect(() => {
    if (recordId) {
      getRecordDetailsByID(recordId);
    }

    return () => {};
  }, [recordId]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  // const prevStep = () => {
  //   setStep((prev) => prev - 1);
  // };

  const handleNatureMortChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      natureMort: {
        type,
        autreDetail: type === "autre" ? prev.natureMort.autreDetail : undefined,
      },
    }));
  };

  const handleBooleanChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout activeMenu={"Ajout Deces"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          {step === 1 && (
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">
                  {recordId ? "Update Record" : "Add Record"}
                </h2>

                {recordId && (
                  <button
                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-base" /> Delete
                  </button>
                )}
              </div>

              {/* Commune & Wilaya de deces */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Commune de deces :
                  </label>

                  <input
                    placeholder="Arabic full name"
                    className="form-input"
                    value={recordData.ArabicFullName}
                    onChange={(e) =>
                      handleValueChange("ArabicFullName", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Wilaya de deces :
                  </label>

                  <input
                    placeholder="Latin full name"
                    className="form-input"
                    value={recordData.LatinFullName}
                    onChange={(e) =>
                      handleValueChange("LatinFullName", e.target.value)
                    }
                    type="text"
                  />
                </div>
              </div>

              {/* Nom & Prenom & Sexe */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Nom :
                  </label>

                  <input
                    placeholder="Arabic full name"
                    className="form-input"
                    value={recordData.ArabicFullName}
                    onChange={(e) =>
                      handleValueChange("ArabicFullName", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Prenom :
                  </label>

                  <input
                    placeholder="Latin full name"
                    className="form-input"
                    value={recordData.LatinFullName}
                    onChange={(e) =>
                      handleValueChange("LatinFullName", e.target.value)
                    }
                    type="text"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Sexe :
                  </label>

                  <select
                    name="Gender"
                    id="Gender"
                    className="form-input"
                    value={recordData.Gender}
                    onChange={(e) =>
                      handleValueChange("Gender", e.target.value)
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* File/fille de */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    File/Fille de :
                  </label>

                  <input
                    placeholder="Father full name"
                    className="form-input"
                    value={recordData.parents.fatherName}
                    onChange={(e) =>
                      handleValueChange("parents", {
                        motherName: recordData.parents.motherName,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4 mt-3">
                  <label className="text-xs font-medium text-slate-600">
                    et de :
                  </label>

                  <input
                    placeholder="Mother full name"
                    className="form-input"
                    value={recordData.parents.motherName}
                    onChange={(e) =>
                      handleValueChange("parents", {
                        fatherName: recordData.parents.fatherName,
                        motherName: e.target.value,
                      })
                    }
                    type="text"
                  />
                </div>
              </div>

              {/* Date et lieu de naissance */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Date de naissance :
                  </label>

                  <input
                    className="form-input"
                    value={recordData.BirthDate}
                    onChange={(e) =>
                      handleValueChange("BirthDate", e.target.value)
                    }
                    type="date"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    a commune
                  </label>

                  <input
                    placeholder="City"
                    className="form-input"
                    value={recordData.City}
                    onChange={(e) => handleValueChange("City", e.target.value)}
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Wilaya
                  </label>

                  <input
                    placeholder="Wilaya"
                    className="form-input"
                    value={recordData.dueDate}
                    onChange={(e) =>
                      handleValueChange("Wilaya", e.target.value)
                    }
                    type="text"
                  />
                </div>
              </div>

              {/* Commune & Wilaya de résidence  */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <label className="text-xs font-medium text-slate-600">
                    Lieu de residence (preciser l'adress exacte) :
                  </label>

                  <input
                    className="form-input"
                    value={recordData.SignedBy}
                    onChange={(e) =>
                      handleValueChange("SignedBy", e.target.value)
                    }
                    type="text"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Commune de résidence :
                  </label>

                  <input
                    placeholder="Arabic full name"
                    className="form-input"
                    value={recordData.ArabicFullName}
                    onChange={(e) =>
                      handleValueChange("ArabicFullName", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Wilaya de résidence :
                  </label>

                  <input
                    placeholder="Latin full name"
                    className="form-input"
                    value={recordData.LatinFullName}
                    onChange={(e) =>
                      handleValueChange("LatinFullName", e.target.value)
                    }
                    type="text"
                  />
                </div>
              </div>

              {/* Date de deces & Age */}
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Date de deces :
                  </label>

                  <input
                    className="form-input"
                    value={recordData.BirthDate}
                    onChange={(e) =>
                      handleValueChange("BirthDate", e.target.value)
                    }
                    type="date"
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Age (en année):
                  </label>

                  <input
                    placeholder="Age"
                    className="form-input"
                    value={recordData.City}
                    onChange={(e) => handleValueChange("City", e.target.value)}
                  />
                </div>
              </div>

              {/* Profession */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Profession (pour les 16 ans et plus):
                </label>

                <input
                  className="form-input"
                  value={recordData.BirthDate}
                  onChange={(e) =>
                    handleValueChange("BirthDate", e.target.value)
                  }
                  type="text"
                />
              </div>

              {/* Lieu de deces */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Lieu du décès :
                </label>

                <CheckboxGroup
                  options={categoryOptions}
                  onChange={handleCategoriesChange}
                />
              </div>

              {/* Reserve a la commune */}
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Réservé a la commune :
                </label>

                <input
                  className="form-input"
                  value={recordData.BirthDate}
                  onChange={(e) =>
                    handleValueChange("BirthDate", e.target.value)
                  }
                  type="number"
                />
              </div>

              {/* Le docteur en médecine soussigné, certifieque la mort de la
                  personne désignée ci-contre, survenue */}
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Le docteur en médecine soussigné, certifieque la mort de la
                  personne désignée ci-contre, survenue
                </p>
                <div className="grid grid-cols-12 gap-4 mt-3">
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      Le :
                    </label>

                    <input
                      className="form-input"
                      value={recordData.BirthDate}
                      onChange={(e) =>
                        handleValueChange("BirthDate", e.target.value)
                      }
                      type="date"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      a (Heure) (s):
                    </label>

                    <input
                      placeholder="City"
                      className="form-input"
                      value={recordData.City}
                      onChange={(e) =>
                        handleValueChange("City", e.target.value)
                      }
                      type="time"
                    />
                  </div>
                </div>
              </div>

              {/* Est réelle et constante de */}
              <div className="mt-3">
                <label className="text-sm font-medium text-slate-600">
                  Est réelle et constante de :
                </label>

                <CheckboxGroupNoOther
                  options={categoryOptionsCause}
                  onChange={handleCategoriesChange}
                />

                <div className="grid grid-cols-12 gap-4 mt-3">
                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      Le :
                    </label>

                    <input
                      className="form-input"
                      value={recordData.BirthDate}
                      onChange={(e) =>
                        handleValueChange("BirthDate", e.target.value)
                      }
                      type="date"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-600">
                      A :
                    </label>

                    <input
                      placeholder="City"
                      className="form-input"
                      value={recordData.City}
                      onChange={(e) =>
                        handleValueChange("City", e.target.value)
                      }
                      type="time"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
              )}

              <div className="flex justify-end mt-7">
                <button
                  className="add-btn"
                  onClick={nextStep}
                  disabled={loading}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="form-card col-span-3">
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-4">
                  Partie I: Maladie(s) ou affection(s) morbide(s) ayant
                  directement provoqué le décès
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Cause directe a)
                    </label>
                    <input
                      type="text"
                      name="causeDirecte"
                      //   value={formData.causeDirecte}
                      //   onChange={handleInputChange}
                      className="form-input"
                      placeholder="Cause directe du décès"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      due à ou consécutive à b)
                    </label>
                    <input
                      type="text"
                      //   value={formData.evenementsMorbides.b}
                      //   onChange={(e) => handleMorbideChange('b', e.target.value)}
                      className="form-input"
                      placeholder="Événement morbide"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      due à ou consécutive à c)
                    </label>
                    <input
                      type="text"
                      //   value={formData.evenementsMorbides.c}
                      //   onChange={(e) => handleMorbideChange('c', e.target.value)}
                      className="form-input"
                      placeholder="Événement morbide"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      due à ou consécutive à d)
                    </label>
                    <input
                      type="text"
                      //   value={formData.evenementsMorbides.d}
                      //   onChange={(e) => handleMorbideChange('d', e.target.value)}
                      className="form-input"
                      placeholder="Événement morbide"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-600 my-3">
                  Partie II: Autres états morbides ayant pu contribuer au décès
                </h3>
                <textarea
                  name="autresEtats"
                  //   value={formData.autresEtats}
                  //   onChange={handleInputChange}
                  className="form-input min-h-[100px]"
                  placeholder="Autres états morbides"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-600 my-3">
                  Partie III: A renseigner par le médecin légiste en cas de mort
                  violente ou de cause indéterminée
                </h3>
                <textarea
                  name="mortViolente"
                  //   value={formData.mortViolente}
                  //   onChange={handleInputChange}
                  className="form-input min-h-[100px]"
                  placeholder="Déterminer la cause du décès après médico-légal"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-4">
                    1. Nature de la mort
                  </h3>
                  <div className="grid grid-cols-2 grid-rows-2 gap-3">
                    {[
                      "naturelle",
                      "accident",
                      "autoInduite",
                      "agression",
                      "indeterminee",
                      "autre",
                    ].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="radio"
                          id={type}
                          name="natureMort"
                          checked={formData.natureMort.type === type}
                          onChange={() => handleNatureMortChange(type)}
                          className="h-4 w-4 accent-blue-600 border-gray-300"
                        />
                        <label
                          htmlFor={type}
                          className="ml-2 text-sm text-gray-700 capitalize"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                    {formData.natureMort.type === "autre" && (
                      <input
                        type="text"
                        value={formData.natureMort.autreDetail || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            natureMort: {
                              ...prev.natureMort,
                              autreDetail: e.target.value,
                            },
                          }))
                        }
                        className="form-input mt-2"
                        placeholder="Préciser"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-4">
                    2. Mortinatalité, périnatalité
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">
                        Grossesse multiple
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={formData.mortalite.grossesseMultiple}
                            onChange={() =>
                              handleBooleanChange(
                                "mortalite.grossesseMultiple",
                                true
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!formData.mortalite.grossesseMultiple}
                            onChange={() =>
                              handleBooleanChange(
                                "mortalite.grossesseMultiple",
                                false
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">Mort-né</label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={formData.mortalite.grossesseMultiple}
                            onChange={() =>
                              handleBooleanChange(
                                "mortalite.grossesseMultiple",
                                true
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!formData.mortalite.grossesseMultiple}
                            onChange={() =>
                              handleBooleanChange(
                                "mortalite.grossesseMultiple",
                                false
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age gestationnel (en semaines)
                      </label>
                      <input
                        type="number"
                        value={formData.mortalite.ageGestationnel}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mortalite: {
                              ...prev.mortalite,
                              ageGestationnel: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Poids à la naissance (en grammes)
                      </label>
                      <input
                        type="number"
                        value={formData.mortalite.poidsNaissance}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mortalite: {
                              ...prev.mortalite,
                              poidsNaissance: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Age de la mère (années)
                      </label>
                      <input
                        type="number"
                        value={formData.mortalite.ageMere}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mortalite: {
                              ...prev.mortalite,
                              ageMere: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        État morbide de la mère
                      </label>
                      <textarea
                        value={formData.mortalite.etatMorbideMere}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mortalite: {
                              ...prev.mortalite,
                              etatMorbideMere: e.target.value,
                            },
                          }))
                        }
                        className="form-input min-h-[100px]"
                        placeholder="Préciser l'état morbide de la mère"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-4">
                    3. Décès maternel
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">
                        Est-ce un décès maternel?
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={formData.decesMaternel.estDecesMaternel}
                            onChange={() =>
                              handleBooleanChange(
                                "decesMaternel.estDecesMaternel",
                                true
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!formData.decesMaternel.estDecesMaternel}
                            onChange={() =>
                              handleBooleanChange(
                                "decesMaternel.estDecesMaternel",
                                false
                              )
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>

                    {formData.decesMaternel.estDecesMaternel && (
                      <div className="space-y-2">
                        {[
                          "grossesse",
                          "accouchement",
                          "42JoursApres",
                          "indetermine",
                        ].map((moment) => (
                          <div key={moment} className="flex items-center">
                            <input
                              type="radio"
                              id={moment}
                              name="momentDeces"
                              checked={formData.decesMaternel.moment === moment}
                              onChange={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  decesMaternel: {
                                    ...prev.decesMaternel,
                                    moment: moment,
                                  },
                                }))
                              }
                              className="h-4 w-4 accent-blue-600"
                            />
                            <label
                              htmlFor={moment}
                              className="ml-2 text-sm text-gray-700"
                            >
                              {moment === "grossesse" && "Durant la grossesse"}
                              {moment === "accouchement" &&
                                "Pendant l'accouchement/avortement"}
                              {moment === "42JoursApres" &&
                                "Dans les 42 jours après l'accouchement/avortement"}
                              {moment === "indetermine" && "Indéterminé"}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-4">
                    4. Intervention chirurgicale
                  </h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-700">
                      Y a-t-il eu intervention chirurgicale quatre (4) semaines
                      avant le décès?
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={formData.interventionChirurgicale}
                          onChange={() =>
                            handleBooleanChange(
                              "interventionChirurgicale",
                              true
                            )
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="ml-2">Oui</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked={!formData.interventionChirurgicale}
                          onChange={() =>
                            handleBooleanChange(
                              "interventionChirurgicale",
                              false
                            )
                          }
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="ml-2">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-600 mb-4">
                    5. Signalement médico-légal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">
                        Obstacle médico-légal à l'inhumation
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.signalementMedicoLegal.obstacleInhumation
                            }
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  obstacleInhumation: true,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={
                              !formData.signalementMedicoLegal
                                .obstacleInhumation
                            }
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  obstacleInhumation: false,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">
                        Mise immédiate en cercueil hermétique
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={
                              formData.signalementMedicoLegal.cercueilHermetique
                            }
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  cercueilHermetique: true,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={
                              !formData.signalementMedicoLegal
                                .cercueilHermetique
                            }
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  cercueilHermetique: false,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-700">
                        Y a-t-il eu une autopsie?
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={formData.signalementMedicoLegal.autopsie}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  autopsie: true,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={!formData.signalementMedicoLegal.autopsie}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                signalementMedicoLegal: {
                                  ...prev.signalementMedicoLegal,
                                  autopsie: false,
                                },
                              }))
                            }
                            className="h-4 w-4 accent-blue-600"
                          />
                          <span className="ml-2">Non</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
              )}

              <div className="flex justify-end mt-7">
                <button
                  className="add-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {recordId ? "UPDATE Record" : "Add Record"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Record"
      >
        <DeleteAlert
          content="Are you sure you want to delete this record?"
          onDelete={() => deleteUser()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default AjoutDeces;
