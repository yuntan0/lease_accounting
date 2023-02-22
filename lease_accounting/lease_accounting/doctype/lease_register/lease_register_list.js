frappe.listview_settings["Lease Register"] = {

    onload: function (listview) {
		listview.page.add_menu_item(__("Create Lease Journal Entry"), function() {
            const dialog = new frappe.ui.Dialog({
    			title: __('Enter Closing Date'),
    			fields: [
    			    {fieldtype: 'Date', label: __('Posting Date'), fieldname: 'posting_date', reqd: 1},
    			    {fieldtype: 'Link', label: __('Company'), options:'Company', fieldname: 'company', reqd: 1}
    			    
    			    ],
			primary_action: function({ posting_date ,company}) {
				frappe.call({
					method: 'fns_accounting.depreciation.post_depreciation_entries11',
					args: {
						posting_date: posting_date,
						company : company
					},
					freeze: true,
					callback: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Successfully Lease Journal Entry Created'),
							alert: true
						});
					},
					error: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Lease Journal Entry Failed. Please try again.'),
							title: __('Lease Journal Entry Failed'),
							indicator: 'red'
						});
					}
				});
			},
			primary_action_label: __('Create Lease Journal Entry')
    		});
    		dialog.show();
		})
		
	    listview.page.add_menu_item(__("Cancel Lease Journal Entry"), function() {
            const dialog = new frappe.ui.Dialog({
    			title: __('Enter Closing Date'),
    			fields: [
    			    {fieldtype: 'Date', label: __('Posting Date'), fieldname: 'posting_date', reqd: 1},
    			    {fieldtype: 'Link', label: __('Company'), options:'Company', fieldname: 'company', reqd: 1}
    			    
    			    ],
			primary_action: function({ posting_date ,company}) {
				frappe.call({
					method: 'fns_accounting.depreciation.cancel_depreciation_entries11',
					args: {
						posting_date: posting_date,
						company : company
					},
					freeze: true,
					callback: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Successfully Lease Journal Entry Cancelled'),
							alert: true
						});
					},
					error: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Lease Journal Entry cancellation Failed. Please try again.'),
							title: __('Lease Journal Entry cancellation Failed'),
							indicator: 'red'
						});
					}
				});
			},
			primary_action_label: __('Cancel Lease Journal Entry')
    		});
    		dialog.show();
		})
		
		listview.page.add_menu_item(__("Create all Lease Journal Entry"), function() {
            const dialog = new frappe.ui.Dialog({
    			title: __('Enter Closing Date'),
    			fields: [
    			    {fieldtype: 'Date', label: __('Posting Date'), fieldname: 'posting_date', reqd: 1}
    			    
    			    ],
			primary_action: function({ posting_date ,company}) {
				frappe.call({
					method: 'fns_accounting.depreciation.post_all_depreciation_entries111',
					args: {
						posting_date: posting_date
					},
					freeze: true,
					callback: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Successfully executed Lease Journal Entry creation'),
							alert: true
						});
					},
					error: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Lease Journal Entry creation Failed. Please try again.'),
							title: __('Lease Journal Entry creation Failed'),
							indicator: 'red'
						});
					}
				});
			},
			primary_action_label: __('Create all Lease Journal Entry')
    		});
    		dialog.show();
		})
		
		listview.page.add_menu_item(__("Cancel all Lease Journal Entry"), function() {
            const dialog = new frappe.ui.Dialog({
    			title: __('Enter Closing Date'),
    			fields: [
    			    {fieldtype: 'Date', label: __('Posting Date'), fieldname: 'posting_date', reqd: 1}
    			    
    			    ],
			primary_action: function({ posting_date ,company}) {
				frappe.call({
					method: 'fns_accounting.depreciation.cancel_all_depreciation_entries111',
					args: {
						posting_date: posting_date
					},
					freeze: true,
					callback: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('Successfully all Lease Journal Entry cancelled'),
							alert: true
						});
					},
					error: function() {
						dialog.hide();
						frappe.msgprint({
							message: __('all Lease Journal Entry cancellation Failed. Please try again.'),
							title: __('all Lease Journal Entry cancellation Failed'),
							indicator: 'red'
						});
					}
				});
			},
			primary_action_label: __('Cancel all Lease Journal Entry')
    		});
    		dialog.show();
		})
	}
}