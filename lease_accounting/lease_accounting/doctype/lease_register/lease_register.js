// Copyright (c) 2023, John Park and contributors
// For license information, please see license.txt

frappe.ui.form.on('Lease Register', {
	refresh: function(frm) {
		
		frm.set_query('cost_center', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'is_group':'0'
				}
			}
		})
		frm.set_query('bank_account', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'account_type' : 'Bank',
					'account_currency' : doc.currency,
					'is_group':'0'
				}
			}
		})
		frm.set_query('lease_asset', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'root_type' : 'Asset',
					'account_currency' : doc.currency,
					'is_group':'0'
				}
			}
		})
		frm.set_query('lease_liability', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'root_type' : 'Liability',
					'account_currency' : doc.currency,
					'is_group':'0'
				}
			}
		})
		frm.set_query('interest_expense', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'account_type' : 'Expense Account',
					'account_currency' : doc.currency,
					'is_group':'0'
				}
			}
		})
	},
	interest_rate: function(frm) {
		// frm.doc.monthly_interest_rate = frm.doc.interest_rate/12;
		cur_frm.set_value('monthly_interest_rate',frm.doc.interest_rate/12);
	},
	item:function(frm){
		frm.doc.item.length()
	}
});
