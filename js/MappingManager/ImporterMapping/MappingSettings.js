import React, { useContext, useEffect, useState } from 'react'
import { MappingContext } from '../MappingContext';
import { getImportersList, getImporterForm, editImporter, getNewImporterForm } from '../MappingQueries';
import Form from "@rjsf/core";

const appData = providenceUIApps.MappingManager.data;

const MappingSettings = () => {

  const { importerId, setImporterId, settingSchema, setSettingSchema, settingFormData, setSettingFormData, importerFormData, setImporterFormData
} = useContext(MappingContext)

  const [settingsUISchema, setSettingsUISchema] = useState({
    "setting_type": {
      classNames: "record_type"
    },
    "setting_numInitialRowsToSkip": {
      classNames: "initial_rows_to_skip",
    },
  })

  useEffect(() => {
    if (importerId) {
      getImporterForm(appData.baseUrl + "/MetadataImport", importerId, data => {
        console.log("getImporterForm: ", data);

        let form = { ...data }
        let jsonProperties = JSON.parse(data.properties);
        form.properties = jsonProperties;

        const settings_properties = Object.keys(form.properties)
          .filter((key) => key.includes("setting"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: form.properties[key]
            });
          }, {});

        // console.log("settings_properties: ", settings_properties);

        let settingSchemaObj = {
          "title": data.title,
          "required": data.required,
          "properties": settings_properties
        };

        const settings_data = Object.keys(JSON.parse(data.values))
          .filter((key) => key.includes("setting"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: JSON.parse(data.values)[key]
            });
          }, {});

        // console.log("settings_data: ", settings_data);
        // console.log("schemaObj: ", schemaObj);
        setSettingSchema(settingSchemaObj);
        setSettingFormData(settings_data)
      })
    } else {
      getNewImporterForm(appData.baseUrl + "/MetadataImport", data => {
        console.log("getNewImporterForm: ", data);

        let form = { ...data }
        let jsonProperties = JSON.parse(data.properties);
        form.properties = jsonProperties;

        const settings_properties = Object.keys(form.properties)
          .filter((key) => key.includes("setting"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: form.properties[key]
            });
          }, {});

      
        let settingSchemaObj = {
          "title": data.title,
          "required": data.required,
          "properties": settings_properties
        };

        const settings_data = Object.keys(JSON.parse(data.values))
          .filter((key) => key.includes("setting"))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: JSON.parse(data.values)[key]
            });
          }, {});

        setSettingSchema(settingSchemaObj);
        setSettingFormData(settings_data)
      })
    }
  }, [importerId]);

  const saveSettings = () => {
    let name = importerFormData["ca_data_importers.preferred_labels.name"]
    let code = importerFormData["ca_data_importers.importer_code"]
    let type = importerFormData["ca_data_importers.table_num"]

    editImporter(
      appData.baseUrl + "/MetadataImport", 
      importerId, 
      name, 
      settingFormData.setting_inputFormats, 
      code, 
      "ca_objects", 
      type, 
      [{ "code": "existingRecordPolicy", "value": "skip_on_idno" }], 
      data => {
        console.log("editImporter: ", data);
        getImportersList();
    })
  }

  // console.log("settingSchema: ", settingSchema);
  // console.log("settingFormData: ", settingFormData);

  return (
    <div className='mapping-settings'>
      <button type="button" className="btn btn-outline-secondary btn-sm" data-toggle="modal" data-target="#exampleModal">
        Settings +
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{ maxHeight: "50%", width: "min-content" }}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Importer Settings</h5>
            </div>
            <div className="modal-body text-left">
              {(settingSchema) ?
                <Form
                  schema={settingSchema}
                  formData={settingFormData}
                  uiSchema={settingsUISchema}
                // onChange={(e) => { saveFormData(e.formData) }}
                // onSubmit={console.log("submitted")}
                // onError={console.log("errors")}
                >
                  <button id="form-submit-button" type="submit" className="btn btn-secondary mr-2" onClick={() => saveSettings()}>Save</button>
                  <button type="button" data-dismiss="modal" aria-label="Close" className="btn btn-secondary">Cancel</button>
                </Form>
                : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MappingSettings