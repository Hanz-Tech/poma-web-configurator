import Ajv, {JSONSchemaType} from "ajv"
const ajv = new Ajv()
import { configInterface } from './default.js';



const schema: JSONSchemaType<configInterface> = {
    type: "object",
    properties: {
      midi_note_1: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_2: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_3: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_4: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_5: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_6: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_7: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_8: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_9: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_10: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_11: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_12: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_13: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_14: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_15: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_16: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_sound: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_pattern: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_bpm: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_special: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_fx: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_play: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_write: {  "$ref": "#/definitions/midi_note_type" },
      po_midi_channel: {  "$ref": "#/definitions/midi_channel" },
      disable_transport: {"$ref": "#/definitions/boolean" },
      po_cc_control: {"$ref": "#/definitions/boolean" },
      volca_fm_velocity: {"$ref": "#/definitions/boolean" },
      volca_fm_midi_ch_1: { "$ref": "#/definitions/midi_channel" },
      volca_fm_midi_ch_2: { "$ref": "#/definitions/midi_channel"},
      sync_out_enabled: {"$ref": "#/definitions/boolean" },
      midi_ppqn: { type: "integer", minimum: 0, maximum: 255 },
      midi_note_record_1: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_2: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_3: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_4: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_5: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_6: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_7: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_8: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_9: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_10: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_11: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_12: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_13: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_14: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_15: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_record_16: {  "$ref": "#/definitions/midi_note_type" },
      looper_enabled: {"$ref": "#/definitions/boolean" },
      looper_autoplay_after_record: {"$ref": "#/definitions/boolean" },
      looper_transport_control_link: {"$ref": "#/definitions/boolean" },
      midi_note_loop_start_stop: {  "$ref": "#/definitions/midi_note_type" },
      midi_note_loop_clear:{  "$ref": "#/definitions/midi_note_type" },
      looper_quantized: {"$ref": "#/definitions/boolean"},
      ble_midi_enabled: {"$ref": "#/definitions/boolean" },
      midi_cc_knob_9: {  "$ref": "#/definitions/midi_cc_type" }
    },
    required: [
        "midi_note_1",
        "midi_note_2",
        "midi_note_3",
        "midi_note_4",
        "midi_note_5",
        "midi_note_6",
        "midi_note_7",
        "midi_note_8",
        "midi_note_9",
        "midi_note_10",
        "midi_note_11",
        "midi_note_12",
        "midi_note_13",
        "midi_note_14",
        "midi_note_15",
        "midi_note_16",
        "midi_note_sound",
        "midi_note_pattern",
        "midi_note_bpm",
        "midi_note_special",
        "midi_note_fx",
        "midi_note_play",
        "midi_note_write",
        "po_midi_channel",
        "disable_transport",
        "po_cc_control",
        "volca_fm_velocity",
        "volca_fm_midi_ch_1",
        "volca_fm_midi_ch_2",
        "sync_out_enabled",
        "midi_ppqn",
        "midi_note_record_1",
        "midi_note_record_2",
        "midi_note_record_3",
        "midi_note_record_4",
        "midi_note_record_5",
        "midi_note_record_6",
        "midi_note_record_7",
        "midi_note_record_8",
        "midi_note_record_9",
        "midi_note_record_10",
        "midi_note_record_11",
        "midi_note_record_12",
        "midi_note_record_13",
        "midi_note_record_14",
        "midi_note_record_15",
        "midi_note_record_16",
        "looper_enabled",
        "looper_autoplay_after_record",
        "looper_transport_control_link",
        "midi_note_loop_start_stop",
        "midi_note_loop_clear",
        "looper_quantized",
        "ble_midi_enabled",
        "midi_cc_knob_9",
      // Add all other properties to the required list as needed
      // ...
    ],
    "definitions": {
      "midi_note_type": {
        "oneOf": [
          {
            "type": "integer",
            "minimum": 0,
            "maximum": 127
          },
          {
            "type": "integer",
            "enum": [255]
          }
        ]
      },
      "midi_cc_type": {
        "oneOf": [
          {
            "type": "integer",
            "minimum": 0,
            "maximum": 119
          },
          {
            "type": "integer",
            "enum": [255]
          }
        ]
      },
      "boolean": {
        "oneOf": [
          {
            "type": "integer",
            "minimum": 0,
            "maximum": 1
          },
          {
            "type": "integer",
            "enum": [255]
          }
        ]
      },
      "midi_channel": {
        "oneOf": [
          {
            "type": "integer",
            "minimum": 1,
            "maximum": 16
          },
          {
            "type": "integer",
            "enum": [255]
          }
        ]
      }
    },
    additionalProperties: true
}

export const validateConfig =ajv.compile(schema)