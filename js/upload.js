/**
 * AI+ Platform | Upload Page JavaScript
 * Handles drag-and-drop file selection, file preview, character counter, and demonstration submission modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const fileNameText = document.getElementById('file-name-text');
  const removeFileBtn = document.getElementById('btn-remove-file');
  const uploadForm = document.getElementById('proof-upload-form');
  const descTextarea = document.getElementById('upload-description');
  const charCounter = document.getElementById('char-count');

  // 1. Drag and Drop events
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (fileNameText && filePreview) {
      const sizeKB = (file.size / 1024).toFixed(1);
      fileNameText.textContent = `${file.name} (${sizeKB} KB)`;
      filePreview.style.display = 'flex';
      if (dropzone) dropzone.style.display = 'none';
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInput) fileInput.value = '';
      if (filePreview) filePreview.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
    });
  }

  // 2. Character Counter
  if (descTextarea && charCounter) {
    descTextarea.addEventListener('input', () => {
      charCounter.textContent = `${descTextarea.value.length} / 500`;
    });
  }

  // 3. Form Submit -> Demonstration Success Modal
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const taskSelect = document.getElementById('upload-task-select');
      const selectedTaskName = taskSelect ? taskSelect.options[taskSelect.selectedIndex].text : 'Selected Task';
      
      const modalTaskName = document.getElementById('preview-task-name');
      if (modalTaskName) {
        modalTaskName.textContent = selectedTaskName;
      }

      if (window.openModal) {
        window.openModal('upload-success-modal');
      }
    });
  }
});
