/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Issue document
 * @param {org.documents.issueDocument} tx issueDocument
 * @transaction
 */
async function issueDocument(tx) { 
    return getAssetRegistry('org.documents.Document')
        .then(function(document_registry) {
      		var factory = getFactory();
			var new_doc = factory.newResource('org.documents', 'Document', tx.docId);
      		new_doc.documentName = tx.docName;
      		new_doc.template = tx.template;
      		new_doc.issuer = tx.issuing_org;
      		new_doc.owner = tx.owner;
      		new_doc.version = 0;
      		new_doc.whitelist = [tx.issuing_org];
            return document_registry.add(new_doc);
       });
}	

/**
 * Issue template document
 * @param {org.documents.issueTemplate} tx issueTemplate
 * @transaction
 */
async function issueTemplate(tx) { 
    return getAssetRegistry('org.documents.Template')
        .then(function(template_registry) {
        	var factory = getFactory();
      		var new_template = factory.newResource('org.documents', 'Template', tx.templateId)
      		new_template.templateName = tx.templateName;
      		new_template.issuing_org = tx.issuingOrg;
            template_registry.add(new_template);
        });
}


/**
 * Nullify a document
 * @param {org.documents.revokeDocument} tx revokeDocument
 * @transaction
 */
async function revokeDocument(tx) {
 	return getAssetRegistry('org.documents.Document')
        .then(function(document_registry) {
        	var factory = getFactory();
      		return document_registry.remove(tx.document);
        });
}

/**
 * Update a document
 * @param {org.documents.updateDocument} tx updateDocument
 * @transaction
 */
async function updateDocument(tx) {
  	return getAssetRegistry('org.documents.Document').then(function(document_registry) {
        	var factory = getFactory();
      		var newId = tx.previous.documentId + "." + (tx.previous.version + 1);
      		var new_doc = factory.newResource('org.documents', 'Document', newId);
      		new_doc.version = tx.previous.version + 1;
        	new_doc.documentName = tx.new_name;
      		new_doc.template = tx.previous.template;
      		new_doc.issuer = tx.previous.issuer;
      		new_doc.owner = tx.previous.owner;
      		new_doc.previous_version = tx.previous;
      		new_doc.whitelist = tx.previous.whitelist;
      		return document_registry.add(new_doc);
          });
}

/**
 * Add an organization to a document's read-only whitelist
 * @param {org.documents.giveAccess} tx giveAccess
 * @transaction
 */
async function giveAccess(tx) {
 	 return getAssetRegistry('org.documents.Document')
        .then(function(document_registry) {
      		tx.document.whitelist.push(tx.organization);
       		return document_registry.update(tx.document);
        });
}

/**
 * Remove an organization to a document's read-only whitelist
 * @param {org.documents.revokeAccess} tx revokeAccess
 * @transaction
 */
async function revokeAccess(tx) {
 	 return getAssetRegistry('org.documents.Document')
        .then(function(document_registry) {
        	var factory = getFactory();
      		for(var i = 0; i < tx.document.whitelist.length; i++) {
             	if(tx.document.whitelist[i].organizationId = tx.organization.organizationId) {
                	tx.document.whitelist.splice(i, 1);
                  	break;
                }
            }
       		return document_registry.update(tx.document);
        });
}

/**
 * Self-terminate an organization to a document's read-only whitelist
 * @param {org.documents.terminateAccess} tx terminateAccess
 * @transaction
 */
async function terminateAccess(tx) {
 	 return getAssetRegistry('org.documents.Document')
        .then(function(document_registry) {
        	var factory = getFactory();
      		for(var i = 0; i < tx.document.whitelist.length; i++) {
             	if(tx.document.whitelist[i].organizationId = tx.organization.organizationId) {
                	tx.document.whitelist.splice(i, 1);
                  	break;
                }
            }
       		return document_registry.update(tx.document);
        });
}
