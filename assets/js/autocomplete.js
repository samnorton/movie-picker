const inputAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {

  root.innerHTML = `
  <div class="input-group">
  
    <div class="input-group-prepend">
      <div class="input-group-text">🔍</div>
    </div>
    <input type="text" class="form-control form-control-lg" id="search" placeholder="Search a movie on both side to compare..">
  </div>
  </div>
  
  <div class="dropdown show">
    <div class="dropdown-menu result" >
    </div>
  </div>
  `;
  
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown-menu');
  const resultsWrapper = root.querySelector('.result');
  
  const onInput = async event => {
    const items = await fetchData(event.target.value);
    
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }
  
    resultsWrapper.innerHTML = '';
  
    dropdown.classList.add('show');
  
    items.forEach(item => {
       const option = document.createElement('a');
     
       option.classList.add('dropdown-item');
       option.innerHTML = renderOption(item);
  
      option.addEventListener('click', () => {
        dropdown.classList.remove('show');
        input.value = inputValue(item);
  
       onOptionSelect(item);
  
      });
   
       resultsWrapper.appendChild(option);
    });
  };
  
  input.addEventListener('input', debounce(onInput, 600)); 
  
  document.addEventListener('click', event => {
  if(!root.contains(event.target)){
      dropdown.classList.remove('show');
  }
  });
  };