var Job = function() {
	this.domainId = 857,
	this.companyId = 827721,
	this.jobId = 0,
	this.description = {
		companyName: 'Kenexa Demo Jobs',
	    companyActivityId: 12,
	    jobDescription: 'Trabajo creado desde el nuevo schema',
	    availabilityId: '4',
	    workDayId: 4,
	    workTime: '8',
	    jobValidity: 60,
	    vacancies: 3,
	    contractTime: 'Un mes',
	    jobTypeId: 2,
	    salary: 100000,
	    salaryRange: 100,
	    showSalary: 1,
	    jobAreaId: 100,
	    jobTitle: 'Vendedor',
	    token: 'e06d62a67c82501b674bb4ce52ef6a6c',
	    client: 'KENEXA',
	    country: 'CL'
	},
	this.requisites = {
	    minimumRequirements: 'Mayor de edad',
	    computerSkillId: 5,
	    applicantProfile: 4,
	    academicSituationId: 3,
	    educationalLevelId: 3
	},
	this.location = {
	    regionId: 6,
	    city: {
	    	id: 14,
	      	description: 'Petorca'
	    },
	    countryId: 1
	},
	this.contactInfo = {
	    companyName: 'Empresa Tec.',
	    email: 'lflorez@co.ibm.com',
	    contact: 'Luis Florez',
	    contactPhone: '7863999779'
	},
	this.token = 'e06d62a67c82501b674bb4ce52ef6a6c',
	this.client = 'KENEXA',
	this.country = 'CL'
};

module.exports = Job;