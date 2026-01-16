class PaymentAlert extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 1rem 0;
                }
                .alert {
                    padding: 1rem;
                    border-radius: 0.375rem;
                    display: flex;
                    align-items: center;
                }
                .alert-icon {
                    margin-right: 0.75rem;
                    flex-shrink: 0;
                }
                .alert-content {
                    flex-grow: 1;
                }
                .alert-title {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .alert-message {
                    font-size: 0.875rem;
                }
                .alert-urgent {
                    background-color: #fee2e2;
                    border-left: 4px solid #dc2626;
                }
                .alert-warning {
                    background-color: #fef3c7;
                    border-left: 4px solid #d97706;
                }
            </style>
            <div class="alert alert-${this.getAttribute('type') || 'warning'}">
                <div class="alert-icon">
                    <i data-feather="${this.getAttribute('icon') || 'alert-circle'}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${this.getAttribute('title') || 'Warning'}</div>
                    <div class="alert-message">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('payment-alert', PaymentAlert);
