$(function() {
    infuser.defaults.templateUrl = "templates";
    //infuser.defaults.templatePrefix = "SomePrefix"
    //infuser.defaults.templateSuffix = "SomeSuffix"
    function State(id, name, cities) {
        return {
            id: ko.observable(id),
            name: ko.observable(name),
            cities: ko.observableArray(cities || ["Dunno"])
        }
    }
    
    function deepCopy(p, c) {
	var c = c || {};
	for (var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			deepCopy(p[i], c[i]);
		} else {
			c[i] = p[i];
		}
	}
	return c;
    }
	
				
	
    function InView(id, name) {
	var vm = {
            id: ko.observable(id),
            name: ko.observable(name),
	    isReady: false,
	    innerVMInitializer:  function () {
		require(["templates/" + name + ".js?t="+Date.now()], function() {
			//load nameVM JS
			var vmName = 'var innerVM = new ' + name + 'VM()';
			eval(vmName);
			allViews[innerVM.name].innerVM = innerVM;
			allViews[innerVM.name].isReady = true;
		});

	    }//,
	    //innerVM: this.innerVMInitializer()
	}
	//vm.innerVMInitializer();
	return vm;
    }
    
    
    InView.prototype.deepCopy = function(source, dest) {
		dest.innerVM = source.innerVM;
		dest.id(source.id());
		dest.name(source.name());
		dest.isReady = source.isReady;
		return dest;
	
    }
    
    InView.prototype.createView = function(id, name){
	var vm = new InView(id, name);
	vm.innerVMInitializer();
	vm.constructor = InView;
	return vm;
    }
    
	
    
    var allViews = {
	lV:	InView.prototype.createView(0, "LeftView"),
	rV:	InView.prototype.createView(1, "RightView")
    }
    var viewModel = {
        allViews: allViews,
	isEditable: ko.observable(false),
        items: ko.observableArray([
                new State(1, "Tennessee", [
                    {name: "Nashville"}, {name: "Chattanooga"}
                ])
                
            ]),
        whichTemplateToUse: function() {
            return viewModel.isEditable() ? 'edit' : 'view';
        },
	leftView: function() {
            return 'LeftView';
        },
	inviews: [
		InView.prototype.deepCopy(allViews['lV'], new InView(0, '')),
		InView.prototype.deepCopy(allViews['rV'], new InView(0, ''))
	],	
	initializeInViews: function(){		
		var index = 0;
		for(key in allViews)
		{
			var v = allViews[key];
			if(v.constructor == InView)
			{
				var localIndex = index;
				viewModel.initializeInViewsByIndex(key, localIndex);				
			}
			index++;
		}
		
	},
	initializeInViewsByIndex: function(key, index){
		var v = allViews[key];
		if(v.isReady == false)
		{
			setTimeout(function() {viewModel.initializeInViewsByIndex(key, index)}, 200);
		}
		else
		{
			InView.prototype.deepCopy(allViews[key], this.inviews[index]); 
		}
	},
	getInViewName: function(index){
		return this.inviews[index].name();
	},
	changeView: function(){
		if(allViews['xX'] == undefined)
		{
			allViews.xX = InView.prototype.createView(2, 'xxxView');
			//allViews.xX.innerVMInitializer();
		}
		try
		{
			
			if(!allViews['xX'].isReady)
			{
				setTimeout(function() {viewModel.changeView()}, 200);
			}
			else
			{
				InView.prototype.deepCopy(allViews['xX'], viewModel.inviews[0]);
			}
			
		}
		catch(e)
		{
			console.log(e);
		}
	},
	changeViewBack: function(){
		InView.prototype.deepCopy(allViews['lV'], this.inviews[0]);		
	},
	
	startBinding: function() {
		var ready = true;
		for(var i in this.inviews)
		{
			if(this.inviews[i].isReady == false){
				ready = false;
				break;
				
			}
		}
		if(ready)
		{
			ko.applyBindings(viewModel);
		}
		else
		{
			setTimeout(function() {viewModel.startBinding();}, 200);
		}
	}
    };
    viewModel.initializeInViews(0);
    viewModel.startBinding();
    
});