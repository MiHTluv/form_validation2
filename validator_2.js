function Validator(formSelector){
    const _this=this;
    //Gan gia tri mac dinh cho tham so(ES5)
    
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }

    var formRules = {};
    /**
     * Quy uoc tao rule
     * - Neu co loi thi return 'error message'
     * - Neu khong co loi thi return 'undefined'
     */
    var validatorRules = {
        required:function(value){
            return value? undefined:"Vui long nhap thong tin";
        },
        email:function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined: "Truong nay phai la Email";
        },
        min:function(min){
            return function(value){
                return value.length>=min?undefined:"Vui long nhap du ki tu";
            }
        }
    };
    
    //Lay ra formElement trong DOM theo 'formSelector
    var formElement= document.querySelector(formSelector);
    //Chi xu li khi co element trong DOM
    if(formElement){
        var inputs=formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');

            for(var rule of rules){
                var isRuleHasValue = rule.includes(':');
                var ruleInfor;
                if(isRuleHasValue){
                    ruleInfor = rule.split(':');
                    rule= ruleInfor[0];
                }

                var ruleFunc = validatorRules[rule];

                if(isRuleHasValue){
                    ruleFunc = ruleFunc(ruleInfor[1]);
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }else{      
                    formRules[input.name]=[ruleFunc];
                }
            }
            //Lang nghe su kien de validate
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }
        function handleValidate(e){
            var rules = formRules[e.target.name];
            var errorMessage;

            // //Tra ve ham
            // var errorMessage = rules.some(function(rule){
            //     return rule(e.target.value);
            // });

            // rules.some(function(rule){
            //     errorMessage = rule(e.target.value);
            //     return errorMessage; 
            // });
            for(var rule of rules){
                errorMessage=rule(e.target.value);
                if(errorMessage){
                    break;
                }
            }
            //Neu co loi
            if(errorMessage){
                var formGroup = getParent(e.target,'.form-group');
                formGroup.classList.add('invalid');
                if(!formGroup) return;

                if(formGroup){
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage)
                        formMessage.innerText = errorMessage;
                }
            }
            return !errorMessage;
        }
        function handleClearError(e){
            var formGroup = getParent(e.target,'.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage)
                        formMessage.innerText = '';
                
            }
        }
    }

    //Xu li hanh vi submit
    formElement.onsubmit = function(e){
        e.preventDefault();

        var inputs=formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for(var input of inputs){
            if(!handleValidate({target: input})){
                isValid = false;
            }
        }
        //Khi khong co loi thi submit form
        // this.onsubmit = function(){

        // };

        if(isValid){
            if(typeof _this.onsubmit == 'function'){
                var enableInput=formElement.querySelectorAll('[name]:not([disabled])');
                console.log(enableInput);
                //chuyen nodelist sang array
                var formValues=Array.from(enableInput).reduce(function(values, input){
                    
                    switch(input.type){
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                            break;
                        case 'checkbox':
                            if(!input.matches(':checked')){
                                values[input.name] = '';
                                return values;
                            }
                            if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name]= input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                },{});      
                _this.onsubmit(formValues);
            }else{
                formElement.submit();
            }
        }
    }
}

// function Validator(formSelector,options){
//     function getParent(element,selector){
//         while(element.parentElement){
//             if(element.parentElement.matches(selector)){
//                 return element.parentElement;
//             }
//             element=element.parentElement;
//         }
//     }
//     var formElement = document.querySelector(formSelector);
//     var formRules={};
//     var validatorRules={
//         required:function(value){
//             return value? undefined:"Vui long nhap thong tin";
//         },
//         email:function(value){
//             var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//             return regex.test(value)? undefined: "Truong nay phai la Email";
//         },
//         min:function(min){
//             return function(value){
//                 return value.length>=min?undefined:"Vui long nhap du ki tu";
//             }
//         }
//     };
//     if(formElement){
//         var inputs = formElement.querySelectorAll('[name][rules]');
//         for(var input of inputs){
//             var rules = input.getAttribute('rules').split('|');
//             for(var rule of rules){
//                 var isRuleHasValue = rule.includes(':');
//                 var ruleInfor;
//                 if(isRuleHasValue){
//                     ruleInfor=rule.split(':');
//                     rule = ruleInfor[0];
//                 }
//                 var ruleFunc = validatorRules[rule];
//                 if(isRuleHasValue){
//                     ruleFunc=ruleFunc(ruleInfor[1]);
//                 }
//                 if(Array.isArray(formRules[input.name])){
//                     formRules[input.name].push(ruleFunc);
//                 }else{
//                     formRules[input.name]=[ruleFunc];
//                 }
//             }
//             input.onblur = handleValidate;
//             input.onclick = handleClearError;
//         }
//         console.log(formRules);
//         function handleValidate(e){
//             var formGroup = getParent(e.target,'.form-group');
//             var errorElement=formGroup.querySelector('.form-message');
//             var rules = formRules[e.target.name];
//             var errorMessage;
//             rules.some(function(rule){
//                 errorMessage = rule(e.target.value);
//                 return errorMessage;
//             });
//             if(errorMessage){
//                 formGroup.classList.add('invalid');
//                 errorElement.innerText = errorMessage;
//             }
//             return !errorMessage;
//         }
//         function handleClearError(e){
//             var formGroup = getParent(e.target,'.form-group');
//             var errorElement=formGroup.querySelector('.form-message');
//             if(formGroup.classList.contains('invalid')){
//                 formGroup.classList.remove('invalid');
//                 errorElement.innerText='';
//             }
//         }
//     }
//     formElement.onsubmit=function(e){
//         e.preventDefault();
//         var isValid = true;
//         var inputs = formElement.querySelectorAll('[name][rules]');
//         for(var input of inputs){
//             if(!handleValidate({target:input})){
//                 isValid = false;
//             }
//         }
        
//         if(isValid){
//             if(typeof options.onsubmit=='function'){
//                 var enableInput = formElement.querySelectorAll('[name]');
//                 var formValues = Array.from(enableInput).reduce(function(values,input){
//                     switch(input.type){
//                         case 'radio':
//                             values[input.name]=formElement.querySelector('[name="'+input.name+'"]:checked');
//                             break;
//                         case 'checkbox':
//                             if(!input.matches(':checked')){
//                                 values[input.name]='';
//                                 return values;
//                             }
//                             if(!Array.isArray(values[input.name])){
//                                 values[input.name]=[];
//                             }
//                             values[input.name].push(input.value);
//                             break;
//                         case 'file':
//                             values[input.name]=input.files;
//                             break;
//                     default:
//                         values[input.name] = input.value;
//                     }
//                     return values;
//                 },{});
//                 options.onsubmit(formValues);
//             }else{
//                 formElement.submit();
//             }
//         }
//     }
// }