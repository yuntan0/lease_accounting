// Copyright (c) 2023, John Park and contributors
// For license information, please see license.txt

frappe.ui.form.on('Lease Category', {
	refresh: function(frm) {

		frm.set_query('bank_account', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'account_type' : 'Bank',
					'is_group':'0'
				}
			}
		})
		frm.set_query('lease_asset', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'root_type' : 'Asset',
					'is_group':'0'
				}
			}
		})
		frm.set_query('lease_liability', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'root_type' : 'Liability',
					'is_group':'0'
				}
			}
		})
		frm.set_query('interest_expense', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'account_type' : 'Expense Account',
					'is_group':'0'
				}
			}
		})
		frm.set_query('expense_account', function(doc) {
			return {
				filters: {
					'company':doc.company,
					'account_type' : 'Expense Account',
					'is_group':'0'
				}
			}
		})
		frm.set_query('advance_account', function(doc) {
			return {
				// filters: {
				// 	'company':doc.company,
				// 	'root_type' : 'Asset',
				// 	'is_group':'0'
				// }
				filters: [
        			["company", "=", doc.company],
					["root_type", "=", 'Asset'],
					["is_group", "=", '0'],
        			["account_number", "like","11111%"]
        		]
			}
		})
	}
});
