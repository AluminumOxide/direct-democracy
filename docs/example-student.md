```
{ 
	parent_id: <root democracy id>
	name: "X Uni Students"
	description: "Official student democracy for X University"
	population: 2143 
	conduct: { 1: "All conduct must adhere to the university code of conduct", ... }
	content: {  }
        meta_name: { update: { approval_percent_minimum: 50 } }
        meta_description: { update: { approval_percent_minimum: 50 } }
        meta_democracies: { add: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 }}
        meta_members: { add: { approval_percent_minimum: 50 }, update: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 } }
        meta_timeouts: { add: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 } }
        meta_conduct: { add: { approval_percent_minimum: 50 }, update: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 } }
        meta_content: { add: { approval_percent_minimum: 50 }, update: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 } }
        meta_meta: { add: { approval_percent_minimum: 50 }, update: { approval_percent_minimum: 50 }, delete: { approval_percent_minimum: 50 } }
}
```
