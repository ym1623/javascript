$("#certificate").change(function(){
	$("#certificate_2").html(certificate_child(this.value));
});

function certificate_child(id){
	var output='';
	if(id=='00'){
		$("#certificate_2").hide();
		$("#certificate_3").show();
	}else{
		$("#certificate_2").show();
		$("#certificate_3").hide();
		for(var i in ce_a){
			if(i.substr(0,2)==id && i.substr(2)!='00') output+='<option value="'+ i +'">'+ ce_a[i] +'</option>';
		}
		return output;
	}
}