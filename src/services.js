/*jshint esversion: 8 */
import axios from 'axios'

export default {
  async fetchData(actionUrl) {
    let data = await axios
      .get(`${actionUrl}`, {
        headers: {
          Authorization: 'Basic ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        return response
      })
    return data.data
  },
  async postData(actionUrl, payload) {
    let data = await axios
      .post(`${actionUrl}`, payload, {
        headers: {
          Authorization: 'Basic ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        return response
      })
    return data.data
  },
  async getDownloadData(actionUrl) {
    let data = await axios
      .get(`${actionUrl}`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      })
      .then((response) => {
        return response
      })
    const url = window.URL.createObjectURL(new Blob([data.data]))
    return url
  },
  async postUploadData(actionUrl, payload) {
    let data = await axios
      .post(`${actionUrl}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response
      })
    return data.data
  },
  async putData(actionUrl, payload) {
    let data = await axios
      .put(`${actionUrl}`, payload, {
        headers: {
          Authorization: 'Basic ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        return response
      })
    return data.data
  },
  async deleteData(actionUrl) {
    let data = await axios
      .delete(`${actionUrl}`, {
        headers: {
          Authorization: 'Basic ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        return response
      })
    return data.data
  },
}
